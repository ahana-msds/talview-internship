import { useQuery, useMutation } from '@apollo/client';
import { GET_PROJECTS } from '../graphql/queries';
import { UPDATE_TASK_STATUS } from '../graphql/mutations';

export const TaskList = ({ projectId }: { projectId: string }) => {
    const { data, loading } = useQuery(GET_PROJECTS);
    const [updateStatus] = useMutation(UPDATE_TASK_STATUS);

    if (loading) return <div>Loading tasks...</div>;

    const project = data.projects.find((p: any) => p.id === projectId);
    if (!project) return <div>Project not found</div>;

    const handleStatusChange = (taskId: string, newStatus: string) => {
        updateStatus({
            variables: { id: taskId, status: newStatus },
        });
    };

    return (
        <div className="task-container">
            <h2>Tasks for {project.name}</h2>
            <div className="task-list">
                {project.tasks.map((task: any) => (
                    <div key={task.id} className={`task-card ${task.status.toLowerCase()}`}>
                        <div className="task-header">
                            <h4>{task.title}</h4>
                            <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        </div>
                        <p>{task.description}</p>
                        <div className="task-actions">
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                            >
                                <option value="TODO">To Do</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="DONE">Done</option>
                            </select>
                            <span className="assignee">Assignee: {task.assignee?.username || 'Unassigned'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
