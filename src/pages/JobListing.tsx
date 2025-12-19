import { BarLoader } from 'react-spinners';
import { useJobs } from '../hooks/useJobs';
import { useEffect, useState } from 'react';
import { getAllJobs } from '@/api/apiJobs';
import JobCard from '@/components/jobs/JobCard';
import { getAllCompanies } from '@/api/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

function JobListing() {
  const [searchQuery, setSearchQuery] = useState<string | null>("")
  const [location, setLocation] = useState<string | null>("")
  const [company_id, setCompany_id] = useState<number | null>(null)
  const { data: jobs, loading: loadingJobs, error: errorJobs, fn: fetchJobs } = useJobs(getAllJobs, { searchQuery, location, company_id });
  const { data: companies, loading: loadingCompanies, fn: fetchCompanies } = useJobs(getAllCompanies);

  useEffect(() => {
    fetchCompanies();
  }, [])

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, location, company_id]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    let formData = new FormData(e.target);

    const query: any = formData.get("search-query");
    if (query === null) fetchJobs()
    else setSearchQuery(query)
  }

  return (
    <div className='px-40'>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      <form onSubmit={handleSearch} className='flex items-center gap-2 h-12 mb-3'>
        <Input
          type="text"
          placeholder="Search Jobs by Title.."
          name='search-query'
          className='h-full flex-1 px-4 text-md'
        />
        <Button variant={"blue"} type='submit' className='h-full sm:w-28 text-md'>
          <Search size={15} />
          Search...
        </Button>
      </form>
      {
        loadingJobs &&
        <BarLoader className='mt-4' width={"100%"} color="#36d7b7" />
      }
      <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loadingJobs === false && (
          jobs?.length !== 0 ?
            jobs?.map(job =>
              <JobCard
                key={job.id}
                job={job}
                isMyJob={undefined}
                savedInit={job?.saved?.length > 0}
                onJobSaved={undefined}
              />
            )
            :
            <p>There's no jobs yet</p>
        )}
      </div>

    </div>
  );
}

export default JobListing;