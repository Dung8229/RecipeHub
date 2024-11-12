import { useState, useEffect } from "react";
import competitionService from '../services/competitions'
import AdminCompetitionListItem from "../components/admin_components/AdminCompetitionListItem";
import AdminCreateCompetitionForm from "../components/admin_components/AdminCreateCompetitionForm";

const AdminManageCompetitionPage = () => {
  const [openComps, setOpenComps] = useState([]); // State để lưu danh sách open competitions
  const [closedComps, setClosedComps] = useState([]); // State để lưu danh sách closed competitions
  const [upcomingComps, setUpcomingComps] = useState([])

  // Hàm để lấy tất cả các cuộc thi
  const fetchCompetitions = async () => {
    try {
        // Phân loại cuộc thi thành upcoming, open và closed
        const dataUpcoming = await competitionService.getAll("upcoming"); // Lấy cuộc thi sắp mở
        setUpcomingComps(dataUpcoming); // Thiết lập state cho upcoming competitions
        console.log('Fetched upcoming competitions:', dataUpcoming); // Log giá trị upcoming competitions

        const dataOpen = await competitionService.getAll("open"); // Lấy cuộc thi đang mở
        setOpenComps(dataOpen); // Thiết lập state cho open competitions
        console.log('Fetched open competitions:', dataOpen); // Log giá trị open competitions

        const dataClosed = await competitionService.getAll("closed"); // Lấy cuộc thi đã đóng
        setClosedComps(dataClosed); // Thiết lập state cho closed competitions
        console.log('Fetched closed competitions:', dataClosed); // Log giá trị closed competitions
    } catch (err) {
        console.log('Failed to fetch competitions:', err.message); // Cập nhật lỗi nếu có
    }
  };

  // Hàm để thêm cuộc thi mới vào danh sách tương ứng khi tạo cuộc thi mới
  const addNewCompetition = (newCompetition) => {
    // Dựa trên startDate và endDate để phân loại cuộc thi
    const now = new Date();
    if (new Date(newCompetition.startDate) > now) {
      setUpcomingComps(upcomingComps.concat(newCompetition))
    } else if (new Date(newCompetition.endDate) > now) {
      setOpenComps(openComps.concat(newCompetition));
    } else {
      setClosedComps(closedComps.concat(newCompetition));
    }
  };

  const removeCompetition = (competitionId) => {
    setUpcomingComps(upcomingComps.filter(comp => comp.id !== competitionId));
    setOpenComps(openComps.filter(comp => comp.id !== competitionId));
    setClosedComps(closedComps.filter(comp => comp.id !== competitionId));
  };

  useEffect(() => {
    fetchCompetitions(); // Gọi hàm khi component được mount
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-bold text-slate-900 text-2xl sm:text-2xl md:text-3xl leading-tight p-6">
        All competitions
      </h1 >
      <div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight p-6">
          Ongoing Competitions
        </h3>
        <ul>
          {openComps.map((competition) => (
            <AdminCompetitionListItem key={competition.id} competition={competition} removeCompetition={removeCompetition} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight p-6">
          Upcoming Competitions
        </h3>
        <ul>
          {upcomingComps.map((competition) => (
            <AdminCompetitionListItem key={competition.id} competition={competition} removeCompetition={removeCompetition} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-lg leading-tight p-6">
          Closed Competitions
        </h3>
        <ul>
          {closedComps.map((competition) => (
            <AdminCompetitionListItem key={competition.id} competition={competition} removeCompetition={removeCompetition} />
          ))}
        </ul>
      </div>
      <AdminCreateCompetitionForm addNewCompetition={addNewCompetition}/>
    </div>
  )
}

export default AdminManageCompetitionPage