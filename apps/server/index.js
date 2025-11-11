import express from 'express';
import { Eta } from 'eta';
import path from 'path';
import { fileURLToPath } from 'url';
import hierarchyRouter from './routes/hierarchy.js';
import entitiesRouter from './routes/entities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const eta = new Eta({ views: path.join(__dirname, 'views') });

app.engine('eta', eta.render.bind(eta));
app.set('view engine', 'eta');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Parcel-built assets
app.use(express.static(path.join(__dirname, 'public')));

// Serve views directory for client-side template access
app.use('/views', express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/api/hierarchy', hierarchyRouter);
app.use('/api/entities', entitiesRouter);

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for client-side rendering
app.get('/api/template/:name', async (req, res) => {
  const template = await eta.renderAsync(`pages/${req.params.name}`, req.query);
  res.json({ html: template });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

