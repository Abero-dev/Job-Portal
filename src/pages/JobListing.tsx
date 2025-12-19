import { BarLoader } from 'react-spinners';
import { useJobs } from '../hooks/useJobs';
import { useEffect, useState, useMemo } from 'react';
import { getAllJobs } from '@/api/apiJobs';
import JobCard from '@/components/jobs/JobCard';
import { getAllCompanies } from '@/api/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectValue, SelectItem } from '@/components/ui/select';
import { State, Country } from 'country-state-city'

function JobListing() {
  const [searchQuery, setSearchQuery] = useState<string | null>("")
  const [location, setLocation] = useState<string | undefined>("")
  const [company_id, setCompany_id] = useState<number | null>(null)
  const { data: jobs, loading: loadingJobs, error: errorJobs, fn: fetchJobs } = useJobs(getAllJobs, { searchQuery, location, company_id });
  const { data: companies, loading: loadingCompanies, fn: fetchCompanies } = useJobs(getAllCompanies);

  const targetCountries = ['US', 'UY', 'ES', 'DE', 'RU', 'AU', 'IN', 'CA'];

  const statesList = useMemo(() => {
    let list: any[] = [];

    targetCountries.forEach(countryCode => {
      const countryStates = State.getStatesOfCountry(countryCode);
      if (countryStates && countryStates.length > 0) {
        const statesWithCountry = countryStates.map(state => ({
          ...state,
          countryCode: countryCode,
          countryName: Country.getCountryByCode(countryCode)?.name || countryCode,
          displayValue: state.name,
          displayLabel: `${state.name} (${Country.getCountryByCode(countryCode)?.name || countryCode})`
        }));
        list = [...list, ...statesWithCountry];
      }
    });

    return list;
  }, [targetCountries]);

  const clearLocationFilter = () => {
    setLocation("");
  };

  const getStateLabel = (stateName: string) => {
    const state = statesList.find(s => s.displayValue === stateName);
    return state ? state.displayLabel : stateName;
  };

  // Función para manejar el cambio de ubicación
  const handleLocationChange = (value: string) => {
    // Si el valor es "all", lo convertimos a cadena vacía
    if (value === "all") {
      setLocation("");
    } else {
      setLocation(value);
    }
  };

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

      {/* Contenedor para el filtro de ubicación con botón de clear */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder='Filter by Location'>
                {location ? getStateLabel(location) : 'Filter by Location'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* Opción para seleccionar todos (ningún filtro) con valor "all" */}
                <SelectItem value="all">All Locations</SelectItem>
                {statesList.map((state) => {
                  return (
                    <SelectItem
                      key={`${state.countryCode}-${state.isoCode}`}
                      value={state.displayValue}
                    >
                      {state.displayLabel}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Botón para limpiar el filtro de ubicación */}
        {location && (
          <Button
            type="button"
            variant="outline"
            onClick={clearLocationFilter}
            className="h-12 px-3"
            title="Clear location filter"
          >
            <X size={18} />
            <span className="sr-only">Clear filter</span>
          </Button>
        )}
      </div>

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