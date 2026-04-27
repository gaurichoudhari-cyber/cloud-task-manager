import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());


// This is a "Cloud Status" API
app.get('/api/info', (req, res) => {
  res.json({
    system: "Task Master Pro",
    version: "1.0.0",
    cloud_provider: "Render",
    containerization: "Docker",
    status: "Operational"
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend service running on port ${PORT}`));