import { BarLoader } from 'react-spinners';
import { useJobs } from '../hooks/useJobs';
import { useEffect, useState, useMemo } from 'react';
import { getAllJobs } from '@/api/apiJobs';
import JobCard from '@/components/jobs/JobCard';
import { getAllCompanies } from '@/api/apiCompanies';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectValue, SelectItem } from '@/components/ui/select';
import { State, Country } from 'country-state-city'

function JobListing() {
  const [searchQuery, setSearchQuery] = useState<string | undefined>("")
  const [location, setLocation] = useState<string | undefined>("")
  const [company_id, setCompany_id] = useState<string | undefined>("")
  const [showFilters, setShowFilters] = useState(false); // Para móvil
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

  const clearFilters = () => {
    setLocation("");
    setCompany_id("");
    setSearchQuery("");
    setShowFilters(false); // Cerrar filtros en móvil después de limpiar
  };

  const getStateLabel = (stateName: string) => {
    const state = statesList.find(s => s.displayValue === stateName);
    return state ? state.displayLabel : stateName;
  };

  const handleLocationChange = (value: string) => {
    if (value === "all") {
      setLocation("");
    } else {
      setLocation(value);
    }
  };

  const handleCompanyChange = (value: string) => {
    if (value === "all") {
      setCompany_id("");
    } else {
      setCompany_id(value);
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
    <div className='px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-4 sm:py-6 md:py-8'>
      {/* Título responsivo */}
      <h1 className='gradient-title font-extrabold text-4xl sm:text-5xl md:text-6xl text-center pb-6 sm:pb-8'>
        Latest Jobs
      </h1>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6'>
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Search Jobs by Title.."
            name='search-query'
            className='h-12 sm:h-11 flex-1 px-4 text-md'
          />
          {/* Botón de filtros para móvil */}
          <Button
            type="button"
            variant="outline"
            className="h-12 sm:hidden flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
          </Button>
        </div>
        <Button variant={"blue"} type='submit' className='h-12 sm:h-11 w-full sm:w-auto text-md sm:px-6'>
          <Search size={18} className="sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </form>

      {/* Filtros - Desktop */}
      <div className="hidden sm:flex items-center gap-2 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="h-12 sm:h-11 flex-1 min-w-[200px]">
              <SelectValue placeholder='Filter by Location'>
                {location ? getStateLabel(location) : 'Filter by Location'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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

          <Select value={company_id} onValueChange={handleCompanyChange}>
            <SelectTrigger className="h-12 sm:h-11 flex-1 min-w-[200px]">
              <SelectValue placeholder='Filter by Company' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Companies</SelectItem>
                {companies?.map((company) => {
                  return (
                    <SelectItem
                      key={company.id}
                      value={company.id}
                    >
                      {company.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {(location || company_id || searchQuery) && (
          <Button
            variant="destructive"
            onClick={clearFilters}
            className="h-12 sm:h-11 px-3 sm:px-4"
          >
            <X size={18} className="mr-2" />
            <span className="hidden sm:inline">Clear filters</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="sm:hidden flex flex-col gap-3 mb-4 p-4 rounded-lg border">
          <div className="flex flex-col gap-3">
            <Select value={location} onValueChange={handleLocationChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder='Filter by Location'>
                  {location ? getStateLabel(location) : 'Filter by Location'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
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

            <Select value={company_id} onValueChange={handleCompanyChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder='Filter by Company' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies?.map((company) => {
                    return (
                      <SelectItem
                        key={company.id}
                        value={company.id}
                      >
                        {company.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {(location || company_id || searchQuery) && (
            <Button
              variant="destructive"
              onClick={clearFilters}
              className="h-12 w-full"
            >
              <X size={18} className="mr-2" />
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {loadingJobs && (
        <div className="mt-4 sm:mt-6">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      )}

      <div className='mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
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
            <div className="col-span-full py-12 text-center">
              <p className="text-lg sm:text-xl text-gray-600">No jobs found matching your criteria</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear filters and try again
              </Button>
            </div>
        )}
      </div>

      {errorJobs && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-600">Error loading jobs. Please try again.</p>
          <Button
            variant="outline"
            onClick={() => fetchJobs()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default JobListing;