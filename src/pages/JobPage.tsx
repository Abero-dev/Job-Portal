import { getSingleJob, updateHiringStatus } from '@/api/apiJobs'
import { useJobs } from '@/hooks/useJobs'
import { useUser } from '@clerk/clerk-react'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import MDEditor from '@uiw/react-md-editor'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-toastify'
import ApplyJobDrawer from '@/components/applications/ApplyJobDrawer'
import ApplicationCard from '@/components/applications/ApplicationCard'

function JobPage() {

  const { id } = useParams()
  const { isLoaded, user } = useUser();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useJobs(getSingleJob, id !== undefined && parseInt(id))

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useJobs(updateHiringStatus);

  const handleStatusChange = async (value: string) => {
    if (!id) return;

    const isOpen = value === "open";

    console.log("Attempting update with:", {
      job_id: parseInt(id),
      isOpen,
      user_id: user?.id,
      recruiter_id: job?.recruiter_id
    });

    const result = await fnHiringStatus({
      job_id: parseInt(id),
      isOpen
    });

    if (result) await fnJob();
  }

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
      {loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7' />}
      {job?.recruiter_id === user?.id &&
        <Select onValueChange={handleStatusChange}>
          <div className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={"Hiring status " + (job?.isOpen ? "( Open )" : "( Closed )")} />
            </SelectTrigger>
          </div>
          <SelectContent>
            <SelectItem
              value="open"
            >
              Open
            </SelectItem>
            <SelectItem
              value="closed"
            >
              Closed
            </SelectItem>
          </SelectContent>
        </Select>
      }
      <h2 className='text-2xl sm:text-3xl font-bold'>About the job</h2>
      <p className='sm:text-lg'>{job?.description}</p>
      <h2 className='text-2xl sm:text-3xl font-bold'>What we are looking for</h2>
      <MDEditor.Markdown source={job?.requirements} />

      {
        job?.recruiter_id !== user?.id &&
        <ApplyJobDrawer job={job} user={user} fetchJob={fnJob}
          applied={job?.applications?.find((app: any) => app.candidate_id === user?.id)} />
      }

      {job?.applications.length > 0 && job?.recruiter_id === user?.id && (
        <div className='flex flex-col gap-y-5 mb-5'>
          <h2 className='text-2xl sm:text-3xl font-bold'>Applications</h2>
          {job?.applications.map((application: any) => {
            console.log(application)
            return <ApplicationCard key={application.id} application={application} isCandidate={false} />
          }
          )}
        </div>
      )}
    </div >
  )
}

export default JobPage