import { useSelector, useDispatch } from "react-redux";
import { useRef, useState } from "react";
import { updateUser } from "../redux/user/userSlice"; // Import your action to update the user profile

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [username, setUsername] = useState(currentUser.username || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file size is less than 2MB
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File size must be less than 2MB.");
        return;
      } else {
        setErrorMessage(""); // Clear error message if file is valid
        uploadFile(file);
      }
    }
  };

  const uploadFile = (file) => {
    setLoading(true);
    setSuccessMessage(""); // Reset success message before new upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Use your upload preset here

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/desvmqruq/image/upload`,
      true
    );

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        setAvatar(data.secure_url); // Set the uploaded image URL
        setUploadProgress(0); // Reset progress after upload
        setSuccessMessage("Image successfully uploaded!"); // Set success message
      } else {
        console.error("Upload failed:", data.error);
        alert(`Upload failed: ${data.error.message || "Unknown error"}`);
      }
      setLoading(false);
    };

    xhr.onerror = () => {
      console.error("Error uploading image");
      alert("Error uploading image: Please try again.");
      setLoading(false);
    };

    xhr.send(formData);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedUser = {
      username,
      email,
      ...(password && { password }), // Only include password if it's filled
      avatar,
    };
    dispatch(updateUser(updatedUser)); // Dispatch your action to update the user profile
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          id="password"
          type="password"
          placeholder="Password (optional)"
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Update"}
        </button>
        {loading && <div>Upload Progress: {uploadProgress}%</div>}{" "}
        {/* Display progress */}
        {successMessage && (
          <div className="text-green-600 mt-2 text-center">
            {successMessage}
          </div>
        )}{" "}
        {/* Display success message */}
        {errorMessage && (
          <div className="text-red-600 mt-2 text-center">{errorMessage}</div>
        )}{" "}
        {/* Display error message */}
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
