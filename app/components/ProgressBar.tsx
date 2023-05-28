interface PB_props {
	bgcolor: string,
	completed: number
}

const ProgressBar = ({ bgcolor, completed }: PB_props) => {
	const containerStyles = {
		height: 20,
		backgroundColor: "#e0e0de"
	}

	const fillerStyles = {
		height: '100%',
		width: `${completed}%`,
		transition: 'width 1s ease-in-out',
		backgroundColor: bgcolor,
		borderRadius: 'inherit',
		textAlign: "right" as const
	}

	const labelStyles = {
		padding: 5,
		color: 'white'
	}

	return (
		<div style={containerStyles} className="progress">
			<div style={fillerStyles}>
				<span style={labelStyles} />
			</div>
		</div>
	);
};

export default ProgressBar;
