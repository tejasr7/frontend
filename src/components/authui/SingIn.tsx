import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, createUserProfile } from "../../firebase/firebase"; // Adjust path as needed
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Import images correctly
import paperPlaneIcon from "../../../src/assets/pen-icon.png";
import googleIcon from "../../../src/assets/google-icon.png";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // Handle email/password sign-in
  const handleSignIn = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        throw new Error("Please fill in all fields.");
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signed in:", userCredential.user);
      
      alert("Successfully signed in!");
      navigate("/"); // Redirect to home or chat page
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      
      // Save user data to Firestore
      await createUserProfile(result.user);
      
      alert("Signed in with Google!");
      navigate("/"); // Redirect to home or chat page
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  // Function to handle authentication errors
  const handleAuthError = (error: any) => {
    let errorMsg = "An error occurred. Please try again.";

    if (error.code === "auth/user-not-found") {
      errorMsg = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMsg = "Incorrect password. Try again.";
    } else if (error.code === "auth/invalid-email") {
      errorMsg = "Please enter a valid email address.";
    } else if (error.message) {
      errorMsg = error.message;
    }

    setErrorMessage(errorMsg);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "25rem", borderRadius: "12px" }}>
        <div className="text-center mb-3">
          <img src={paperPlaneIcon} alt="Paper Plane" style={{ height: "50px" }} />
        </div>
        <h4 className="text-center fw-bold">Sign In</h4>
        <p className="text-center text-muted">Welcome back to QuestNote!</p>

        {/* Google Sign-In */}
        <button
          className="btn btn-light border w-100 mb-3 d-flex align-items-center justify-content-center"
          onClick={handleGoogleSignIn}
        >
          <img src={googleIcon} alt="Google Icon" style={{ height: "20px", marginRight: "10px" }} />
          Sign in with Google
        </button>

        <div className="text-center my-2 text-muted">or</div>

        {/* Email and Password Fields */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3 input-group">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="alert alert-danger text-center py-1">{errorMessage}</div>
        )}

        {/* Buttons */}
        <div className="d-flex justify-content-between">
          <button className="btn btn-light border" onClick={() => navigate("/")}>
            Back to Home
          </button>
          <button className="btn btn-dark" onClick={handleSignIn}>
            Sign In
          </button>
        </div>

        {/* Sign-Up Redirect */}
        <div className="text-center mt-3">
          <small>
            No account?{" "}
            <span className="text-primary" style={{ cursor: "pointer" }} onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignIn;



// // src/pages/Login.tsx
// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
//       <div className="card p-4 shadow-lg" style={{ width: "25rem", borderRadius: "12px" }}>
//         <div className="text-center mb-3">
//           <img src="/paper-plane-icon.png" alt="Paper Plane" style={{ height: "50px" }} />
//         </div>
//         <h4 className="text-center fw-bold">Sign In</h4>
//         <p className="text-center text-muted">Welcome back to QuestNote!</p>

//         {/* Google Sign-In Button Placeholder */}
//         <button
//           className="btn btn-light border w-100 mb-3 d-flex align-items-center justify-content-center"
//         >
//           <img
//             src="/google-icon.svg"
//             alt="Google Icon"
//             style={{ height: "20px", marginRight: "10px" }}
//           />
//           Sign in with Google
//         </button>

//         <div className="text-center my-2 text-muted">or</div>

//         {/* Email and Password Fields */}
//         <div className="mb-3">
//           <input
//             type="email"
//             className="form-control"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
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
//             Sign In
//           </button>
//         </div>

//         {/* Sign-Up Redirect */}
//         <div className="text-center mt-3">
//           <small>
//             No account? <span className="text-primary" style={{ cursor: "pointer" }}>Sign Up</span>
//           </small>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// // src/App.tsx
