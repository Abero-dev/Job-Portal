import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, User } from 'lucide-react'

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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl text-center">Please sign in to continue.</div>
      </div>
    )
  }

  const role = user.unsafeMetadata?.role as string | undefined

  return (
    <main className="flex flex-col justify-center items-center min-h-screen px-4 py-8 sm:px-6 md:px-8 lg:px-40">
      <h2 className="gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tighter text-center mb-8 sm:mb-12 md:mb-16">
        I want to be a ...
      </h2>

      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8">
        {
          role !== 'candidate' &&
          <Button
            variant={'blue'}
            className="h-20 sm:h-24 md:h-28 lg:h-32 w-full sm:w-auto min-w-50 md:min-w-62.5 text-lg sm:text-xl md:text-2xl px-6 sm:px-8 md:px-10 flex items-center justify-center gap-3 sm:gap-4"
            onClick={() => handleRoleSelection('candidate')}
          >
            <User className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            Candidate
          </Button>
        }
        {
          role !== 'recruiter' &&
          <Button
            variant={'magenta'}
            className="h-20 sm:h-24 md:h-28 lg:h-32 w-full sm:w-auto min-w-50 md:min-w-62.5 text-lg sm:text-xl md:text-2xl px-6 sm:px-8 md:px-10 flex items-center justify-center gap-3 sm:gap-4"
            onClick={() => handleRoleSelection('recruiter')}
          >
            <BriefcaseBusiness className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
            Recruiter
          </Button>
        }
      </div>

      {
        role &&
        <div className="mt-12 sm:mt-16 md:mt-20 text-center px-4">
          <p className="text-xl sm:text-2xl md:text-3xl">
            You are a
            <span className={`ml-2 font-bold ${role === 'candidate' ? 'text-blue-500' : 'text-purple-700'}`}>
              {role}
            </span>
            <span className="ml-2">right now</span>
          </p>

          <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-md">
            {role === 'candidate'
              ? "As a candidate, you can browse and apply for jobs that match your skills."
              : "As a recruiter, you can post job openings and manage applications."
            }
          </p>
        </div>
      }

      {role && (
        <div className="mt-8 sm:mt-10">
          <Button
            variant="outline"
            onClick={() => navigate(role === 'candidate' ? '/jobs' : '/post-job')}
            className="text-base sm:text-lg px-6 sm:px-8"
          >
            Continue as {role}
          </Button>
        </div>
      )}
    </main>
  )
}

export default Onboarding