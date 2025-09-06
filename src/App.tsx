import { Link, Route, Routes } from "react-router-dom";

export default function App() {
	return (
		<div>
			<h1>Photo Showcase</h1>
			<nav>
				<Link to="/">Home</Link> | <Link to="/about">About</Link>
			</nav>
			<Routes>
				<Route path="/" element={"Home Page"} />
				<Route path="/about" element={"About Page"} />
			</Routes>
		</div>
	);
}
