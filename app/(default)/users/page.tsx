async function getUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users")
    if (!response.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return response.json();
}


export default async function Users() {
    const usersData = await getUsers();
    return (
        <>
            <ul>
                {usersData.map((user: { id: number, name: string }) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </>
    )

}
