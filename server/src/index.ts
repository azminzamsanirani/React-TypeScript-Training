import express, { Request, Response } from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'training',
    password: 'admin123',
    port: 5432,
});


app.get('/countries', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM CountryCurrency ORDER BY id');
        const countries = result.rows;
        res.json(countries);
        client.release();
    } catch (error) {
        console.error('Error executing county', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/countries', async (req: Request, res: Response) => {
    try {
        const { country_name, value } = req.body; // request body contains country_name and value
        const client = await pool.connect();
        const result = await client.query('INSERT INTO CountryCurrency (country_name, value) VALUES ($1, $2) RETURNING *', [country_name, value]);
        const newCountry = result.rows[0];
        res.status(201).json(newCountry);
        client.release();
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/countries/:id', async (req: Request, res: Response) => {
    try {
        const { country_name, value } = req.body;
        const countryId = req.params.id;
        const client = await pool.connect();
        const result = await client.query('UPDATE CountryCurrency SET country_name = $1, value = $2 WHERE id = $3 RETURNING *', [country_name, value, countryId]);
        const updatedCountry = result.rows[0];
        if (!updatedCountry) {
            return res.status(404).send('Country not found');
        }
        res.json(updatedCountry);
        client.release();
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/countries/:id', async (req: Request, res: Response) => {
    try {
        const countryId = req.params.id;
        const client = await pool.connect();
        const result = await client.query('DELETE FROM CountryCurrency WHERE id = $1 RETURNING *', [countryId]);
        const deletedCountry = result.rows[0];
        if (!deletedCountry) {
            return res.status(404).send('Country not found');
        }
        res.json(deletedCountry);
        client.release();
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM UserData ORDER BY id');
        const users = result.rows;
        res.json(users);
        client.release();
    } catch (error) {
        console.error('Error executing user', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, position, country } = req.body;
        const client = await pool.connect();
        const result = await client.query('INSERT INTO UserData (id, name, position, country) VALUES ($1, $2, $3, $4) RETURNING *', [id, name, position, country]);
        const newUsers = result.rows[0];
        res.status(201).json(newUsers);
        client.release();
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/events', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM events ORDER BY id');
        const events = result.rows;
        res.json(events);
        client.release();
    } catch (error) {
        console.error('Error getting events', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/events', async (req: Request, res: Response) => {
    try {
        const { title, notes, date, priority } = req.body;
        const client = await pool.connect();
        const result = await client.query('INSERT INTO events (title, notes, date, priority) VALUES ($1, $2, $3, $4) RETURNING *', [title, notes, date, priority]);
        const newEvents = result.rows[0];
        res.status(201).json(newEvents);
        client.release();
    } catch (error) {
        console.error('Error inserting event', error);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/events/:id', async (req: Request, res: Response) => {
    try {
        const { title, notes, date, priority } = req.body;
        const EventId = req.params.id;
        const client = await pool.connect();
        const result = await client.query('UPDATE events SET title = $1, notes = $2, date = $3, priority = $4 WHERE id = $5 RETURNING *', [title, notes, date, priority, EventId]); const updatedEvent = result.rows[0];
        if (!updatedEvent) {
            return res.status(404).send('Event not found');
        }
        res.json(updatedEvent);
        client.release();
    } catch (error) {
        console.error('Error updating event', error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/events/:id', async (req: Request, res: Response) => {
    try {
        const eventId = req.params.id;
        const client = await pool.connect();
        const result = await client.query('DELETE FROM events WHERE id = $1 RETURNING *', [eventId]);
        const deletedEvent = result.rows[0];
        if (!deletedEvent) {
            return res.status(404).send('Country not found');
        }
        res.json(deletedEvent);
        client.release();
    } catch (error) {
        console.error('Error deleting event', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Sites
app.get('/sites', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM sites ORDER BY site_id');
        const sites = result.rows;
        res.json(sites);
        client.release();
    } catch (error) {
        console.error('Error getting sites', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Plants
app.get('/plants', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM plants ORDER BY plant_id');
        const plants = result.rows;
        res.json(plants);
        client.release();
    } catch (error) {
        console.error('Error getting plants', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Departments
app.get('/departments', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM departments ORDER BY department_id');
        const departments = result.rows;
        res.json(departments);
        client.release();
    } catch (error) {
        console.error('Error getting departments', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Work Centers
app.get('/work_centers', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM work_centers ORDER BY work_center_id');
        const workCenters = result.rows;
        res.json(workCenters);
        client.release();
    } catch (error) {
        console.error('Error getting work centers', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Work Stations
app.get('/work_stations', async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM work_stations ORDER BY work_station_id');
        const workStations = result.rows;
        res.json(workStations);
        client.release();
    } catch (error) {
        console.error('Error getting work stations', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Assets
app.get('/assets/:id', async (req: Request, res: Response) => {
    try {
        const workStationId = req.params.id;
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM assets WHERE work_station_id = $1 ORDER BY asset_id', [workStationId]);
        const assets = result.rows;
        res.json(assets);
        client.release();
    } catch (error) {
        console.error('Error getting assets', error);
        res.status(500).send('Internal Server Error');
    }
});

// For Transactions
app.get('/transactions/:timestamp', async (req: Request, res: Response) => {
    try {
        const timestamp = req.params.timestamp;
        const startOfDayUTC = new Date(`${timestamp.split('T')[0]}T00:00:00.000Z`);
        const endOfDayUTC = new Date(`${timestamp.split('T')[0]}T23:59:59.999Z`);

        // Adjust for 8 hours (assuming UTC+8)
        startOfDayUTC.setHours(startOfDayUTC.getHours() + 8);
        endOfDayUTC.setHours(endOfDayUTC.getHours() + 8);

        const startOfDay = startOfDayUTC.toISOString();
        const endOfDay = endOfDayUTC.toISOString();

        const client = await pool.connect();
        const result = await client.query('SELECT * FROM transactions WHERE timestamp >= $1 AND timestamp <= $2', [startOfDay, endOfDay]);

        // Convert timestamps to UTC
        const transactions = result.rows.map((transaction) => {
            const adjustedTimestamp = new Date(transaction.timestamp);
            adjustedTimestamp.setHours(adjustedTimestamp.getHours() + 8);
            return { ...transaction, timestamp: adjustedTimestamp };
        });

        // Filter transactions based on the date part of the provided timestamp
        const filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.timestamp.toISOString().split('T')[0]);
            const requestDate = new Date(timestamp.split('T')[0]);
            return transactionDate.getTime() === requestDate.getTime();
        });

        res.json(filteredTransactions);
        client.release();
    } catch (error) {
        console.error('Error getting transactions', error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
