import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

function Onboarding() {
  const { isLoaded, user } = useUser()
  const navigate = useNavigate()

  const handleRoleSelection = async (role: string) => {
    if (!user) return

    try {
      await user.update({
        unsafeMetadata: { role }
      })
      navigate(role === 'recruiter' ? '/post-job' : '/jobs')
    } catch (err) {
      console.error('Error updating role:', err)
    }
  }
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in to continue.</div>
  }

  const role = user.unsafeMetadata?.role as string | undefined

  return (
    <main className='flex flex-col justify-center items-center mt-32 px-40'>
      <h2 className='gradient-title font-extrabold text-7xl sm:text-8xl tracking-tighter'>
        I want to be a ...
      </h2>
      <div className='mt-16 flex justify-center gap-x-4'>
        {
          role !== 'candidate' &&
          <Button
            variant={'blue'}
            className='h-32 text-2xl px-30'
            onClick={() => handleRoleSelection('candidate')}
          >
            Candidate
          </Button>
        }
        {
          role !== 'recruiter' &&

          <Button
            variant={'magenta'}
            className='h-32 text-2xl px-30'
            onClick={() => handleRoleSelection('recruiter')}
          >
            Recruiter
          </Button>
        }
      </div>
      {
        role &&
        <p className='text-3xl mt-20'>
          You are a
          <span className={`${role === 'candidate' ? 'text-blue-500' : 'text-purple-700'}`}> {role} </span>
          right now
        </p>
      }
    </main>
  )
}

export default Onboarding