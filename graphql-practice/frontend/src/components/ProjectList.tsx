import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../graphql/queries';

export const ProjectList = ({ onSelectProject }: { onSelectProject: (id: string) => void }) => {
    const { loading, error, data } = useQuery(GET_PROJECTS);

    if (loading) return <div className="loading">Loading projects...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;

    return (
        <div className="project-grid">
            {data.projects.map((project: any) => (
                <div key={project.id} className="project-card" onClick={() => onSelectProject(project.id)}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div className="project-footer">
                        <span>Owner: {project.owner.username}</span>
                        <span>Tasks: {project.tasks.length}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
