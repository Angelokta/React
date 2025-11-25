export default function Mahasiswa({ nama, npm, skill }) {
    return (
        <div className="Mahasiswa">
            <h2>{nama} ({npm})</h2>
            {skill && <p>Skill: {skill}</p>}
        </div>
    );
}