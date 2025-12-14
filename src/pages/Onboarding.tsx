import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

function Onboarding() {

  const { user } = useUser();
  const navigate = useNavigate();

  const handleRoleSelection = async (role: string) => {
    await user?.update({
      unsafeMetadata: { role }
    })
      .then(() => {
        navigate(role === 'recruiter' ? "/post-job" : "/jobs")
      })
      .catch((err) => {
        console.error("Error updating role:", err)
      })
  }

  useEffect(() => {
    if (user?.unsafeMetadata.role) {
      navigate(
        user?.unsafeMetadata.role === 'recruiter' ? "/post-job" : "/jobs"
      )
    }
  }, [user])

  return (
    <main className='flex flex-col justify-center items-center mt-32 px-40'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>I'm a ...</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full'>
        <Button
          variant={"blue"}
          className='h-32 text-2xl'
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant={"magenta"}
          className='h-32 text-2xl'
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </main>
  )
}

export default Onboarding