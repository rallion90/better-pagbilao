import { Landmark, Map, Sprout, UsersRound } from "lucide-react"

const CardStat = () => {
    return (
        <section className="border-b border-slate-200 bg-bayan-mist">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-bayan-blue">
                <Landmark className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-500">Municipal Class</p>
                <p className="text-xl font-black">1st Class</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">Official town class</p>
              </div>
            </div>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-red-50 text-bayan-red">
                <UsersRound className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-500">Population</p>
                <p className="text-xl font-black">82,132</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">2024 population count</p>
              </div>
            </div>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-bayan-green">
                <Map className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-500">Barangays</p>
                <p className="text-xl font-black">27</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">6 urban, 21 rural</p>
              </div>
            </div>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-amber-50 text-amber-700">
                <Sprout className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-500">Land Area</p>
                <p className="text-xl font-black">17,760 hectares</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">Total town land area</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    )
}

export default CardStat
