import React, { useState } from 'react';
import {
    useGetPostsQuery,
    useAddPostMutation,
    useDeletePostMutation
} from '../services/postsApi';
import { Trash2, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PostList = () => {
    const [limit, setLimit] = useState(6);
    const { data: posts, isLoading, isError, error, refetch } = useGetPostsQuery(limit);
    const [addPost, { isLoading: isAdding }] = useAddPostMutation();
    const [deletePost] = useDeletePostMutation();

    const handleAddPost = async () => {
        try {
            await addPost({
                title: 'New Practice Post',
                body: 'This post demonstrates RTK Query mutations and cache invalidation.',
                userId: 1,
            }).unwrap();
        } catch (err) {
            console.error('Failed to add post:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="post-grid">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="loading-skeleton"></div>
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
                <AlertCircle size={24} />
                <div>
                    <h3 style={{ margin: 0 }}>Error Loading Posts</h3>
                    <p style={{ margin: 0 }}>{error?.message || 'Something went wrong while fetching data.'}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Show Posts:</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            background: 'var(--card-dark)',
                            color: 'inherit',
                            border: '1px solid var(--border-dark)'
                        }}
                    >
                        <option value={3}>3 Posts</option>
                        <option value={6}>6 Posts</option>
                        <option value={9}>9 Posts</option>
                        <option value={12}>12 Posts</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" onClick={() => refetch()} style={{ background: 'transparent', border: '1px solid var(--border-dark)' }}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                    <button className="btn btn-primary" onClick={handleAddPost} disabled={isAdding}>
                        <Plus size={18} />
                        {isAdding ? 'Adding...' : 'Add Post'}
                    </button>
                </div>
            </div>

            <motion.div
                className="post-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence mode='popLayout'>
                    {posts?.map((post) => (
                        <motion.div
                            layout
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card"
                            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                        >
                            <div>
                                <span className="badge" style={{ marginBottom: '1rem', display: 'inline-block' }}>ID: {post.id}</span>
                                <h3 style={{ fontSize: '1.125rem', lineHeight: '1.4' }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                    {post.body.substring(0, 100)}...
                                </p>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-dark)', paddingTop: '1rem' }}>
                                <button
                                    className="btn"
                                    onClick={() => deletePost(post.id)}
                                    style={{ color: '#f87171', background: 'transparent' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default PostList;
