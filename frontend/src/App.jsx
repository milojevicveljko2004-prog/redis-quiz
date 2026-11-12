import { useEffect, useState } from 'react';

export default function App() {
  const [players, setPlayers] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        const response = await fetch('/api/leaderboard/overall');

        if (!response.ok) {
          throw new Error(`Greška pri učitavanju (${response.status}).`);
        }

        setPlayers(await response.json());
      } catch (error) {
        setError(error.message);
      }
    }

    loadLeaderboard();
  }, []);

  return (
    <main>
      <h1>Ukupna rang-lista</h1>

      {error && <p role="alert">{error}</p>}
      {!error && players === null && <p>Učitavanje…</p>}
      {players?.length === 0 && <p>Rang-lista je prazna.</p>}

      {players?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Mesto</th>
              <th>Igrač</th>
              <th>Bodovi</th>
            </tr>
          </thead>
          <tbody>
            {players.map(({ rank, player, points }) => (
              <tr key={player}>
                <td>{rank}</td>
                <td>{player}</td>
                <td>{points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}