import { getSingleJob } from '@/api/apiJobs'
import { useJobs } from '@/hooks/useJobs'
import { useUser } from '@clerk/clerk-react'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import MDEditor from '@uiw/react-md-editor'

function JobPage() {

  const { id } = useParams()
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useJobs(getSingleJob, id !== undefined && parseInt(id))

  useEffect(() => {
    if (isLoaded) fnJob()
  }, [isLoaded])

  if (!isLoaded || loadingJob) return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  return (
    <div className='px-4 lg:px-40 mt-5 flex flex-col gap-8'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.title}</h1>
        <img src={job?.company?.logo_url} alt={job?.title} className='h-12' />
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <MapPinIcon />
          {job?.location}
        </div>
        <div className='flex gap-2 '>
          <Briefcase />
          {job?.applications?.length} Applicants
        </div>
        <div className='flex gap-2'>
          {job?.isOpen ? <><DoorOpen /> Open</> : <><DoorClosed /> Closed</>}
        </div>
      </div>
      <div>

      </div>
      <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
      <p className='sm:text-lg'>{job?.description}</p>
      <h2 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h2>
      <MDEditor.Markdown source={job?.requirements} />
    </div>
  )
}

export default JobPage