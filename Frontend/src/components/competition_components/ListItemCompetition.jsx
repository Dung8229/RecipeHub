import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const ListItemCompetition = ({ competition }) => {
  const now = new Date()
  const startDate = new Date(competition.startDate)
  const selectionDate = new Date(competition.winnerSelectionStartDate)
  const endDate = new Date(competition.endDate)

  return (
    <article className="max-h-50 p-6">
      <div className="flex justify-between items-center space-x-20 relative flex">
        <div>
          <h2 className="font-semibold text-lg sm:text-xl md:text-2xl text-slate-900">{competition.title}</h2>
          <dl className="mt-0 mb-10 text-sm font-medium">
            <div className="flex-none min-w-30 mb-5 font-normal">
              <dt className="sr-only">Description</dt>
              <dd className="text-sm sm:text-lg md:text-lg text-slate-500">{competition.description}</dd>
            </div>
            <div className="w-full font-small justify-between">
              <dt className="sr-only">Time left</dt>
              <dd className="text-red-500 font-bold">
                <FontAwesomeIcon icon={faClock} />
                {startDate > now ? (
                  ` Open in ${Math.ceil((startDate - now) / (1000 * 60 * 60 * 24))} days`
                ) : competition.timeLeft > 0 ? (
                  ` ${competition.timeLeft} days left`
                ) : now < endDate ? (
                  ' Winner selection in progress'
                ) : (
                  ' Closed'
                )}
              </dd>
            </div>
            <div className="w-full font-normal justify-between">
              <dt className="sr-only">Button</dt>
              <dd className="absolute bottom-0 left-0 flex items-center">
                <Link
                  to={`/competitions/${competition.id}/information`}
                  className="mt-2 hover:bg-primaryHover group flex items-center rounded-md bg-primary text-white text-sm font-medium px-5 py-1 shadow-sm"
                >
                  View
                </Link>
              </dd>
            </div>
          </dl>
        </div>
        <img src={competition.image} alt="" className="object-cover flex-none rounded-md bg-slate-100 w-40 max-h-50" />
      </div>
    </article>
  )
}

export default ListItemCompetition