import { useJobs } from '../hooks/useJobs';
import { useEffect } from 'react';

function JobListing() {
  const { jobs, loading, error, fetchJobs } = useJobs();

  useEffect(() => {
    fetchJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jobs?.map(job => (
        <div key={job.id}>{job.title}</div>
      ))}
    </div>
  );
}

export default JobListing;