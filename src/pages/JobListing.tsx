import { BarLoader } from 'react-spinners';
import { useJobs } from '../hooks/useJobs';
import { useEffect, useState } from 'react';
import { getAllJobs } from '@/api/apiJobs';
import { useCompanies } from '@/hooks/useCompanies';
import JobCard from '@/components/jobs/JobCard';

function JobListing() {
  const [searchQuery, setSearchQuery] = useState<string | null>("")
  const [location, setLocation] = useState<string | null>("")
  const [company_id, setCompany_id] = useState<number | null>(null)
  const { jobs, loadingJobs, errorJobs, fetchJobs } = useJobs(getAllJobs, { searchQuery, location, company_id });

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, location, company_id]);

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>
      {
        loadingJobs &&
        <BarLoader className='mt-4' width={"100%"} color="#36d7b7" />
      }
      <div className='px-40 mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loadingJobs === false && (
          jobs?.length !== 0 ?
            jobs?.map(job =>
              <JobCard key={job.id} job={job} />
            )
            :
            <p>There's no jobs yet</p>
        )}
      </div>

    </div>
  );
}

export default JobListing;