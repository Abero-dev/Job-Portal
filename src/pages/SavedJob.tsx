import { getSavedJobs } from '@/api/apiJobs'
import JobCard from '@/components/jobs/JobCard';
import { useJobs } from '@/hooks/useJobs'
import { useUser } from '@clerk/clerk-react';
import { useEffect } from 'react'
import { BarLoader } from 'react-spinners';

function SavedJob() {

  const { isLoaded } = useUser();

  const {
    loading: loadingSavedJobs,
    error: errorSavedJobs,
    data: dataSavedJobs,
    fn: fnSavedJobs
  } = useJobs(getSavedJobs)

  useEffect(() => {
    if (isLoaded) fnSavedJobs();
  }, [isLoaded])

  if (!isLoaded || loadingSavedJobs) return <BarLoader width={"100%"} color='#36d7b7' />

  return (
    <div className='lg:px-40 px-4 flex flex-col items-center gap-8 pt-8'>
      <h1 className='gradient-title font-extrabold text-6xl'>Saved Jobs</h1>

      {
        dataSavedJobs?.length ?
          <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4'>
            {dataSavedJobs.map((savedJob: any) =>
              <JobCard
                key={savedJob.id}
                job={savedJob?.job}
                savedInit={true}
                onJobSaved={fnSavedJobs}
                isMyJob={undefined}
              />
            )}
          </div> :
          <div className='text-center'>No saved jobs found</div>
      }

    </div>
  )
}

export default SavedJob