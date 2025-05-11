import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tgUser, setTgUser] = useState(null);
  const [form, setForm] = useState({ name: '', budget: '' });

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    setTgUser(tg.initDataUnsafe.user);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: tgUser.id,
        name: form.name,
        budget: parseInt(form.budget)
      })
    });
    alert('Анкета отправлена!');
  };

  return (
    <div className="App">
      <h2>Добро пожаловать, {tgUser?.first_name || 'гость'}!</h2>
      <input name="name" placeholder="Имя" onChange={handleChange} />
      <input name="budget" placeholder="Бюджет" type="number" onChange={handleChange} />
      <button onClick={handleSubmit}>Отправить</button>
    </div>
  );
}

export default App;
