import React, { useState, useEffect } from 'react';
import competitionService from '../../services/competitions'

const AdminManageCompetitionForm = ({ id }) => {
  const [formData, setFormData] = useState({
    title: '',
    imageURL: '',
    imageFile: null, // Lưu file ảnh khi chọn từ máy
    imageSource: 'url', // Mặc định chọn 'url'
    description: '',
    detailDescription: '',
    startDate: '',
    winnerSelectionStartDate: '',
    endDate: '',
    prize: '',
  })
  const [prizeGiven, setPrizeGiven] = useState(false)

  const fetchCompetitionDetails = async (id) => {
    try {
      const competitionDetails = await competitionService.getDetail(id);
      setPrizeGiven(competitionDetails.prizeGiven)
  
      if (competitionDetails.image.includes('uploads')) {
        // Nếu là đường dẫn file, tải file ảnh về và tạo File object
        const response = await fetch(`/uploads/${competitionDetails.image.split('/').pop()}`); // Tải ảnh về
        const blob = await response.blob(); // Chuyển ảnh thành blob
        const file = new File([blob], competitionDetails.image.split('/').pop(), { type: blob.type }); // Tạo File object
  
        setFormData({
          title: competitionDetails.title,
          imageSource: 'file',
          imageFile: file, // Lưu File object vào state
          imageURL: '',
          description: competitionDetails.description,
          detailDescription: competitionDetails.detailDescription,
          startDate: competitionDetails.startDate,
          winnerSelectionStartDate: competitionDetails.winnerSelectionStartDate,
          endDate: competitionDetails.endDate,
          prize: competitionDetails.prize,
        });
      } else {
        // Nếu là URL, chỉ cần lưu URL vào state
        setFormData({
          title: competitionDetails.title,
          imageSource: 'url',
          imageURL: competitionDetails.image,
          imageFile: null,
          description: competitionDetails.description,
          detailDescription: competitionDetails.detailDescription,
          startDate: competitionDetails.startDate,
          winnerSelectionStartDate: competitionDetails.winnerSelectionStartDate,
          endDate: competitionDetails.endDate,
          prize: competitionDetails.prize,
        });
      }
    } catch (error) {
      console.error(`Error fetching competition details id: ${id}`, error);
    }
  };  

  useEffect(() => {
    if (id) {
      fetchCompetitionDetails(id);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      // Lưu file ảnh vào state khi chọn file
      setFormData((prevData) => ({
        ...prevData,
        imageFile: files[0],
      }));
    } else if (name === 'imageSource') {
      // Chuyển đổi giữa imageURL và imageFile
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { startDate, winnerSelectionStartDate, endDate } = formData;

    // Kiểm tra tính hợp lệ của ngày
    if (new Date(winnerSelectionStartDate) <= new Date(startDate)) {
      alert('Winner selection date must be after the start date.');
      return;
    }

    if (new Date(endDate) <= new Date(winnerSelectionStartDate)) {
      alert('End date must be after the winner selection date.');
      return;
    }

    if (prizeGiven) {
      const userConfirmed = confirm("You have already awarded a prize. Are you sure about changing this competition's details?");
      if (!userConfirmed) {
        return;
      }
    }    

    try {
      
      const updatedCompetition = competitionService.update(
        id,
        formData.title, 
        formData.imageFile, // Nếu có ảnh file
        formData.imageURL, // Nếu có URL ảnh
        formData.description,
        formData.detailDescription,
        formData.startDate,
        formData.winnerSelectionStartDate,
        formData.endDate,
        formData.prize
      )

      alert('Competition updated successfully!');
    } catch (error) {
      console.error('Error updating competition:', error);
      alert('Failed to update competition.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Change Competition Details</h2>

      {/* Title */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* Image Source Selection */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Image Source</label>
        <div className="flex space-x-4">
          <label>
            <input
              type="radio"
              name="imageSource"
              value="url"
              checked={formData.imageSource === 'url'}
              onChange={handleChange}
              className="mr-2"
            />
            URL
          </label>
          <label>
            <input
              type="radio"
              name="imageSource"
              value="file"
              checked={formData.imageSource === 'file'}
              onChange={handleChange}
              className="mr-2"
            />
            Upload File
          </label>
        </div>
      </div>

      {/* Image URL (only visible if "URL" is selected) */}
      {formData.imageSource === 'url' && (
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="imageURL"
            value={formData.imageURL}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter image URL"
          />
        </div>
      )}

      {/* Image File (only visible if "Upload File" is selected) */}
      {formData.imageSource === 'file' && (
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Image Upload</label>
          <input
            type="file"
            name="imageFile"
            onChange={handleChange}
            accept="image/*" // Chỉ chấp nhận file ảnh
            className="w-full px-3 py-2 border rounded-md"
          />
          {formData.imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(formData.imageFile)} // Hiển thị ảnh đã chọn
                alt="Competition preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>
      )}

      {/* Description */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Detail Description */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Detail Description</label>
        <textarea
          name="detailDescription"
          value={formData.detailDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Start Date */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* Selection Date */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Winner Selection Start Date</label>
        <input
          type="date"
          name="winnerSelectionStartDate"
          value={formData.winnerSelectionStartDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* End Date */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      {/* Prize */}
      <div className="mb-4">
        <label className="block font-medium text-gray-700">Prize</label>
        <input
          type="text"
          name="prize"
          value={formData.prize}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primaryHover"
      >
        Update Competition
      </button>
    </form>
  );
};

export default AdminManageCompetitionForm;
