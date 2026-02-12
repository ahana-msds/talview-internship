const HASURA_ENDPOINT = 'http://localhost:8080/v1/metadata';
const ADMIN_SECRET = 'myadminsecretkey';

const fetchMetadata = async (type, args) => {
    try {
        const response = await fetch(HASURA_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': ADMIN_SECRET,
            },
            body: JSON.stringify({ type, args }),
        });
        const result = await response.json();
        if (result.error || result.code) {
            // Ignore errors like "already exists" or "already tracked"
            const msg = result.error || result.message || '';
            if (msg.includes('already tracked') || msg.includes('already exists') || msg.includes('not found') || msg.includes('does not exist')) {
                return { success: true, ignored: true, message: msg };
            }
            console.warn(` Warning for ${type}:`, msg);
        }
        return result;
    } catch (err) {
        console.error(` Fetch error for ${type}:`, err.message);
        return { error: err.message };
    }
};

const waitForHasura = async (retries = 15) => {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch('http://localhost:8080/v1/version');
            if (res.ok) return true;
        } catch (e) { }
        console.log(`⏳ Waiting for Hasura to be ready... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return false;
};

const setup = async () => {
    console.log(' Starting Hasura Auto-Configuration...');

    const isReady = await waitForHasura();
    if (!isReady) {
        console.error(' Hasura is not reachable. Please ensure Docker is running.');
        process.exit(1);
    }

    const tables = ['users', 'packages', 'package_logs'];

    // 0. Ensure Data Source is Connected
    console.log(' Ensuring Data Source is connected...');
    const sourceCheck = await fetchMetadata('export_metadata', {});
    const sourceExists = sourceCheck.sources && sourceCheck.sources.some(s => s.name === 'default');

    if (!sourceExists) {
        await fetchMetadata('pg_add_source', {
            name: 'default',
            configuration: {
                connection_info: {
                    database_url: process.env.PG_DATABASE_URL || 'postgres://postgres:postgrespassword@postgres:5432/hasura_demo_db',
                    pool_settings: {
                        retries: 1,
                        idle_timeout: 180,
                        max_connections: 50
                    }
                }
            }
        });
        console.log(' Connected "default" data source.');
    }

    // 1. Track Tables
    for (const table of tables) {
        console.log(` Tracking table: ${table}...`);
        await fetchMetadata('pg_track_table', {
            source: 'default',
            table: { schema: 'public', name: table }
        });
    }

    // 2. Establish Relationships
    console.log(' Setting up relationships...');
    const relations = [
        { table: 'packages', name: 'sender', using: { foreign_key_constraint_on: 'sender_id' }, type: 'pg_create_object_relationship' },
        { table: 'packages', name: 'receiver', using: { foreign_key_constraint_on: 'receiver_id' }, type: 'pg_create_object_relationship' },
        { table: 'packages', name: 'agent', using: { foreign_key_constraint_on: 'agent_id' }, type: 'pg_create_object_relationship' },
        { table: 'packages', name: 'package_logs', using: { foreign_key_constraint_on: { table: 'package_logs', column: 'package_id' } }, type: 'pg_create_array_relationship' },
        { table: 'package_logs', name: 'package', using: { foreign_key_constraint_on: 'package_id' }, type: 'pg_create_object_relationship' }
    ];

    for (const rel of relations) {
        await fetchMetadata(rel.type, {
            source: 'default',
            table: rel.table,
            name: rel.name,
            using: rel.using
        });
    }

    // 3. Set Permissions
    console.log(' Configuring Role-Based Access Control...');

    const roles = ['agent', 'customer', 'manager', 'public'];

    // Users table permissions
    for (const role of roles) {
        console.log(` Setting user permissions for ${role}...`);
        await fetchMetadata('pg_drop_select_permission', { source: 'default', table: 'users', role });
        await fetchMetadata('pg_create_select_permission', {
            source: 'default',
            table: 'users',
            role,
            permission: {
                columns: ['id', 'username', 'role', 'email', 'password'],
                filter: {},
                allow_aggregations: true
            }
        });
    }

    // Public signup
    await fetchMetadata('pg_drop_insert_permission', { source: 'default', table: 'users', role: 'public' });
    await fetchMetadata('pg_create_insert_permission', {
        source: 'default',
        table: 'users',
        role: 'public',
        permission: {
            check: {},
            columns: ['username', 'email', 'password', 'role']
        }
    });

    // Package permissions
    const packageRoles = ['manager', 'agent', 'customer', 'public'];
    for (const role of packageRoles) {
        console.log(` Setting package permissions for ${role}...`);
        await fetchMetadata('pg_drop_select_permission', { source: 'default', table: 'packages', role });

        let filter = {};
        if (role === 'agent') {
            filter = {
                _or: [
                    { agent_id: { _eq: 'x-hasura-user-id' } },
                    { _and: [{ agent_id: { _is_null: true } }, { status: { _eq: 'pending' } }] }
                ]
            };
        } else if (role === 'customer') {
            filter = { _or: [{ sender_id: { _eq: 'x-hasura-user-id' } }, { receiver_id: { _eq: 'x-hasura-user-id' } }] };
        } else if (role === 'public') {
            filter = { id: { _lt: 0 } };
        }

        const allPackageColumns = [
            'id', 'tracking_number', 'contents', 'status',
            'sender_id', 'receiver_id', 'agent_id',
            'sender_name', 'sender_phone', 'sender_address',
            'receiver_name', 'receiver_phone', 'receiver_address',
            'location_lat', 'location_lng', 'created_at', 'updated_at'
        ];

        await fetchMetadata('pg_create_select_permission', {
            source: 'default',
            table: 'packages',
            role,
            permission: { columns: allPackageColumns, filter, allow_aggregations: true }
        });

        if (role === 'manager') {
            await fetchMetadata('pg_drop_insert_permission', { source: 'default', table: 'packages', role });
            await fetchMetadata('pg_create_insert_permission', {
                source: 'default',
                table: 'packages',
                role,
                // Exclude auto-generated columns for insert if necessary, but list all settable ones
                permission: { check: {}, columns: allPackageColumns.filter(c => !['id', 'tracking_number', 'created_at', 'updated_at'].includes(c)) }
            });
            await fetchMetadata('pg_drop_update_permission', { source: 'default', table: 'packages', role });
            await fetchMetadata('pg_create_update_permission', {
                source: 'default',
                table: 'packages',
                role,
                permission: { columns: allPackageColumns, filter: {}, check: null }
            });
        } else if (role === 'agent') {
            await fetchMetadata('pg_drop_update_permission', { source: 'default', table: 'packages', role });
            await fetchMetadata('pg_create_update_permission', {
                source: 'default',
                table: 'packages',
                role,
                permission: { columns: ['status', 'agent_id', 'location_lat', 'location_lng'], filter: { _or: [{ agent_id: { _eq: 'x-hasura-user-id' } }, { agent_id: { _is_null: true } }] }, check: null }
            });
        } else if (role === 'customer') {
            await fetchMetadata('pg_drop_insert_permission', { source: 'default', table: 'packages', role });
            await fetchMetadata('pg_create_insert_permission', {
                source: 'default',
                table: 'packages',
                role,
                permission: {
                    check: { sender_id: { _eq: 'x-hasura-user-id' } },
                    columns: ['contents', 'status', 'sender_id', 'receiver_id', 'sender_name', 'sender_phone', 'sender_address', 'receiver_name', 'receiver_phone', 'receiver_address']
                }
            });
        }
    }

    // Package Logs permissions (important for tracking)
    for (const role of ['manager', 'agent', 'customer', 'public']) {
        console.log(` Setting package_logs permissions for ${role}...`);
        await fetchMetadata('pg_drop_select_permission', { source: 'default', table: 'package_logs', role });
        await fetchMetadata('pg_create_select_permission', {
            source: 'default',
            table: 'package_logs',
            role,
            permission: { columns: ['id', 'package_id', 'status', 'note', 'created_at'], filter: {}, allow_aggregations: true }
        });
    }

    // 3b. Configure Actions
    console.log(' Configuring Actions...');

    // Drop Action first to ensure clean state
    await fetchMetadata('drop_action', { name: 'calculate_quote', clear_data: true });

    // Define Types for Action
    await fetchMetadata('set_custom_types', {
        input_objects: [
            {
                name: 'ShippingInput',
                fields: [
                    { name: 'weight', type: 'Int!' },
                    { name: 'distance', type: 'Int!' },
                    { name: 'express', type: 'Boolean' }
                ]
            }
        ],
        objects: [
            {
                name: 'QuoteOutput',
                fields: [
                    { name: 'cost', type: 'Float!' },
                    { name: 'eta', type: 'String!' }
                ]
            }
        ],
        scalars: []
    });

    // Create Action
    await fetchMetadata('create_action', {
        name: 'calculate_quote',
        definition: {
            kind: 'synchronous',
            type: 'query',
            handler: 'http://functions:3000/calculate-quote',
            output_type: 'QuoteOutput',
            arguments: [
                { name: 'input', type: 'ShippingInput!' }
            ]
        },
        permissions: [
            { role: 'manager' },
            { role: 'customer' },
            { role: 'agent' }
        ]
    });

    // 4. Force Metadata Reload to refresh GraphQL Schema
    console.log(' Reloading Hasura Metadata...');
    await fetchMetadata('reload_metadata', {});

    // Final Verification Check
    console.log(' Performing final schema verification...');
    const verifyRoles = ['manager', 'customer'];
    for (const role of verifyRoles) {
        const query = {
            query: `query { __type(name: "mutation_root") { fields { name } } }`
        };
        const response = await fetch('http://localhost:8080/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-hasura-admin-secret': ADMIN_SECRET,
                'x-hasura-role': role
            },
            body: JSON.stringify(query)
        });
        const res = await response.json();
        const fields = res.data?.__type?.fields || [];
        const hasInsert = fields.some(f => f.name === 'insert_packages_one');

        if (hasInsert) {
            console.log(` Role '${role}' has 'insert_packages_one' mutation.`);
        } else {
            console.error(` Role '${role}' is MISSING 'insert_packages_one' mutation!`);
            process.exit(1);
        }
    }

    console.log(' Hasura Configuration Verified and Complete!');
};

setup();
