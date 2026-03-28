import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const data = {
  "persons": [
    {
      "id": 1,
      "name": "Juan Dela Cruz",
      "age": 28,
      "phone": "+639171234567"
    },
    {
      "id": 2,
      "name": "Maria Santos",
      "age": 32,
      "phone": "+639189876543"
    },
    {
      "id": 3,
      "name": "Carlos Reyes",
      "age": 25,
      "phone": "+639155551234"
    },
    {
      "id": 4,
      "name": "Ana Lopez",
      "age": 30,
      "phone": "+639166667890"
    },
    {
      "id": 5,
      "name": "Mark Bautista",
      "age": 35,
      "phone": "+639177778888"
    }
  ],
  "schedules": [
    {
      "id": 1,
      "date": "2026-03-28T09:00:00.000Z",
      "personId": 1,
      "time": "09:00 AM",
      "status": "confirmed"
    },
    {
      "id": 2,
      "date": "2026-03-28T13:30:00.000Z",
      "personId": 2,
      "time": "01:30 PM",
      "status": "pending"
    },
    {
      "id": 3,
      "date": "2026-03-29T10:15:00.000Z",
      "personId": 3,
      "time": "10:15 AM",
      "status": "completed"
    },
    {
      "id": 4,
      "date": "2026-03-29T15:45:00.000Z",
      "personId": 4,
      "time": "03:45 PM",
      "status": "cancelled"
    },
    {
      "id": 5,
      "date": "2026-03-28T08:00:00.000Z",
      "personId": 5,
      "time": "08:00 AM",
      "status": "confirmed"
    },
    {
      "id": 6,
      "date": "2026-03-30T11:30:00.000Z",
      "personId": 1,
      "time": "11:30 AM",
      "status": "pending"
    },
    {
      "id": 7,
      "date": "2026-03-30T14:00:00.000Z",
      "personId": 2,
      "time": "02:00 PM",
      "status": "confirmed"
    }
  ]
}

// GET request to send all data to the client
app.get('/', async (req: Request, res: Response) => {
    try {
        res.send(JSON.stringify(data));
    } catch (err) {
        if (err instanceof Error) {
          res.status(500).json({ message: 'Error reading JSON file: ' + err.message });
        } else {
          res.status(500).json({ message: 'Unknown error' });
        }
    }
});

// POST request to add an appointment to JSON data
// id, date, personId, time should be provided in the HTTP request body
app.post('/', async (req: Request, res: Response) => {
    const { id, date, personId, time } = req.body;

    try {
      data.schedules.push(({
          id: id,
          date: date,
          personId: personId,
          time: time,
          status: 'pending',
      }));

    } catch (err) {
        if (err instanceof Error) {
          res.status(500).json({ message: 'Adding appointment unsuccessful: ' + err.message });
        } else {
          res.status(500).json({ message: 'Unknown error' });
        }
    }

    res.json({
        message: 'Schedule is successfully added',
        personId,
        date,
    });
});

// PATCH request to handle update the status of an appointment. It needs id of an appointment to update as a parameter
// status as a string ('pending', 'confirmed', 'canceled', 'completed') should be provided in the HTTP request body
app.patch('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  try {
    const index = data.schedules.findIndex(schedule => schedule.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    data.schedules[index]!.status = status;

    res.json({
      message: 'appointment status is updated',
      schedules: data.schedules[index],
    });

  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Update unsuccessful: ' + err.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

// DELETE request to remove an appointment from the JSON
// id of an appointment as a parameter is needed
app.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const index = data.schedules.findIndex(schedule => schedule.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    data.schedules.splice(index, 1);

    res.json({
      message: `appointment with an id of ${id} is deleted`,
      schedules: data.schedules,
    });

  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Deletion unsuccessful: ' + err.message });
    } else {
      res.status(500).json({ message: 'Unknown error' });
    }
  }
});

app.listen(PORT, () => {
    console.log(`Server is now running on ${PORT}`);
});