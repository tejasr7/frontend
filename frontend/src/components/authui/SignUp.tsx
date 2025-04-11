import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, db } from "../../firebase/firebase"; // Ensure db is properly exported
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Import images correctly
import penIcon from "../../../src/assets/pen-icon.png";
import googleIcon from "../../../src/assets/google-icon.png";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Store user data in Firestore
  const saveUserToFirestore = async (userId: string, name: string, email: string) => {
    try {
      await setDoc(doc(db, "users", userId), { name, email });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
      setErrorMessage("Could not save user data. Please try again.");
    }
  };

  // Handle email/password sign-up
  const handleSignUp = async () => {
    try {
      if (!name.trim()) throw new Error("Please enter your name.");
      if (!email.trim()) throw new Error("Please enter a valid email.");
      if (password.length < 6) throw new Error("Password must be at least 6 characters long.");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await saveUserToFirestore(user.uid, name, email);

      alert("Account created successfully!");
      navigate("/"); // Redirect to chat page
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await saveUserToFirestore(user.uid, user.displayName || "Google User", user.email || "");
      }

      alert("Signed in with Google!");
      navigate("/"); // Redirect to chat page
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  // Function to handle authentication errors
  const handleAuthError = (error: any) => {
    let errorMsg = "An error occurred. Please try again.";
    if (error.code === "auth/email-already-in-use") errorMsg = "This email is already in use.";
    else if (error.code === "auth/weak-password") errorMsg = "Password should be at least 6 characters.";
    else if (error.code === "auth/invalid-email") errorMsg = "Please enter a valid email address.";
    else if (error.message) errorMsg = error.message;

    setErrorMessage(errorMsg);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "25rem", borderRadius: "12px" }}>
        <div className="text-center mb-3">
          <img src={penIcon} alt="Pen Icon" style={{ height: "50px" }} />
        </div>
        <h4 className="text-center fw-bold">Sign Up</h4>
        <p className="text-center text-muted">Welcome to QuestNote! Sign up to get started.</p>

        {/* Google Sign-Up */}
        <button
          className="btn btn-light border w-100 mb-3 d-flex align-items-center justify-content-center"
          onClick={handleGoogleSignUp}
        >
          <img src={googleIcon} alt="Google Icon" style={{ height: "20px", marginRight: "10px" }} />
          Sign Up with Google
        </button>

        <div className="text-center my-2 text-muted">or create an account</div>

        {/* Name Field */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Field */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field */}
        <div className="mb-3 input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && <div className="alert alert-danger text-center py-1">{errorMessage}</div>}

        {/* Sign Up Button */}
        <button className="btn btn-dark w-100" onClick={handleSignUp}>
          Sign Up
        </button>

        {/* Log In Redirect */}
        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <a href="/signin" className="text-primary" style={{ textDecoration: "none" }}>
              Log In
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignUp;




// // src/pages/SignUp.tsx
// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const SignUp: React.FC = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow-lg" style={{ width: "25rem", borderRadius: "12px" }}>
//         <div className="text-center mb-3">
//           <img src="/paper-plane-icon.png" alt="Paper Plane" style={{ height: "50px" }} />
//         </div>
//         <h4 className="text-center fw-bold">Sign Up</h4>
//         <p className="text-center text-muted">Welcome to QuestNote! Sign up to get started.</p>

//         {/* Google Sign-Up */}
//         <button
//           className="btn btn-light border w-100 mb-3 d-flex align-items-center justify-content-center"
//         >
//           <img
//             src="/google-icon.svg"
//             alt="Google Icon"
//             style={{ height: "20px", marginRight: "10px" }}
//           />
//           Sign Up with Google
//         </button>

//         <div className="text-center my-2 text-muted">or create an account</div>

//         {/* Name Field */}
//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         {/* Email Field */}
//         <div className="mb-3">
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         {/* Password Field */}
//         <div className="mb-3 input-group">
//           <input
//             type={showPassword ? "text" : "password"}
//             className="form-control"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button
//             className="btn btn-outline-secondary"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? "🙈" : "👁️"}
//           </button>
//         </div>

//         {/* CAPTCHA Placeholder */}
//         <div className="mb-3 text-center">
//           <div className="p-2 border rounded bg-light">Cloudflare CAPTCHA Placeholder</div>
//         </div>

//         {/* Buttons */}
//         <div className="d-flex justify-content-between">
//           <button
//             className="btn btn-light border"
//           >
//             Back to Home
//           </button>
//           <button
//             className="btn btn-dark"
//           >
//             Sign Up
//           </button>
//         </div>

//         {/* Log In Redirect */}
//         <div className="text-center mt-3">
//           <small>
//             Already have an account? <span className="text-primary" style={{ cursor: "pointer" }}><a href="/signin"> Log In </a></span>
//           </small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;




