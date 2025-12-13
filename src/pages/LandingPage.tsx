import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import companies from '../data/companies.json'
import faqs from '../data/faq.json'
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

function LandingPage() {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 px-5 lg:px-40">
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
      <Carousel
        plugins={[
          Autoplay({ delay: 2000, stopOnInteraction: false })
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-x-5 lg:gap-x-20 items-center">
          {companies.map((companie) => {
            return (
              <CarouselItem key={companie.id} className="basis-1/3 lg:basis-1/6">
                <img src={companie.path} alt={companie.name} className="h-9 sm:h-14 object-contain" />
              </CarouselItem>
            )
          }
          )}
        </CarouselContent>
      </Carousel>

      <img src="/banner.webp" alt="banner" className="rounded-4xl" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => {
          return (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>
                {faq.question}w
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          )
        })}

      </Accordion>
    </main >
  )
}

export default LandingPage