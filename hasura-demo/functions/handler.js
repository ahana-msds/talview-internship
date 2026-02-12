// This mimics an AWS Lambda handler
// event has: { session_variables, input: { weight, distance, express } }

exports.handler = async (event) => {
    // Hasura wraps args in 'input' key. If arg name is 'input', it's event.input.input
    const data = event.input.input || event.input || {};
    const { weight, distance, express } = data;

    // 1. Business Logic Exception Handling
    if (weight > 50) {
        throw { message: "Oversized Load: Max weight is 50kg. Please contact freight support." };
    }

    // 2. Calculation Logic
    const baseRate = 5.00;
    const weightRate = 2.00; // per kg
    const distanceRate = 0.10; // per km

    let cost = baseRate + (weight * weightRate) + (distance * distanceRate);

    if (express) {
        cost += 10.00;
    }

    // 3. ETA Logic
    // Standard: 1 day per 100km
    // Express: 1 day per 300km
    const speed = express ? 300 : 100;
    const days = Math.ceil(distance / speed);

    // Calculate date
    const date = new Date();
    date.setDate(date.getDate() + days);

    const eta = date.toISOString().split('T')[0]; // YYYY-MM-DD

    return {
        cost: parseFloat(cost.toFixed(2)),
        eta: eta
    };
};
