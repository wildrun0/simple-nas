async function getUserInfo(id: number){
	const resp = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
	return resp.json()
}

export default async function User({
	params: { id },
}: {
	params: { id: number }
}) {
	let user_data = await getUserInfo(id);
	return(
		<div>
			<h3>{user_data.name}</h3>
			<p>{user_data.email}</p>
		</div>
	)
}
