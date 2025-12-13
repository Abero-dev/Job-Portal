import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

function LandingPage() {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center text-5xl lg:text-6xl font-extrabold px-5">
        <h1 className="gradient-title">Find The Job Of Your Dreams</h1>
      </section>
      <p className="text-center text-stone-300 text-2xl lg:text-3xl px-5">
        Explore thousand of opportunities to grow your career and achieve your goals.
      </p>
      <div className="flex justify-center gap-x-10">
        <Link to='/jobs'>
          <Button variant={"blue"} size={"xl"}>Find Jobs</Button>
        </Link>
        <Link to='/post-job'>
          <Button variant={"magenta"} size={"xl"}>Post a Job</Button>
        </Link>
      </div>
      {/* carrousel */}

      {/* banner */}

      <section>
        {/* cards */}
      </section>

      {/* accordion */}
    </main>
  )
}

export default LandingPage