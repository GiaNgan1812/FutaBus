// bus
LOAD CSV FROM 'file: ///bus.csv' AS row FIELDTERMINATOR ';'
WITH row
WHERE row[0] IS NOT null
UNWIND RANGE(0, size(row) - 1) AS columnNumber
WITH row, columnNumber
MERGE (a:bus {
  IDBus: row[0],
  departure:
  
  
CASE WHEN size(row) > 1 THEN row[1] ELSE '' END,
  destination:
  
  
CASE WHEN size(row) > 2 THEN row[2] ELSE '' END,
  type:
  
  
CASE WHEN size(row) > 3 THEN row[3] ELSE 'null' END,
  
  price:
  
  
CASE WHEN size(row) > 4 THEN row[4] ELSE 'null' END
  })
  RETURN a.IDBus, a.departure, a.destination, a.type, a.price;
  
// seat
  LOAD CSV FROM 'file: ///seat.csv' AS row FIELDTERMINATOR ';'
  WITH row
  WHERE row[0] IS NOT null
  UNWIND RANGE(0, size(row) - 1) AS columnNumber
  WITH row, columnNumber
  MERGE (a:seat {
    IDSeat: row[0],
    status:
    
    
CASE WHEN row[1] IS null THEN 'null' ELSE row[1] END
    })
    RETURN a.IDSeat, a.status;
    
// stop
    LOAD CSV FROM 'file: ///stop.csv' AS row FIELDTERMINATOR ';'
    WITH row
    WHERE row[0] IS NOT null
    UNWIND RANGE(0, size(row) - 1) AS columnNumber
    WITH row, columnNumber
    MERGE (a:stop {
      IDStop: row[0],
      stop:
      
      
CASE WHEN row[1] IS null THEN 'null' ELSE row[1] END,
      stop_detail:
      
      
CASE WHEN size(row) > 2 THEN row[2] ELSE '' END
      
      })
      RETURN a.IDStop, a.stop, a.stop_detail;
      
// schedule
      LOAD CSV FROM 'file: ///schedule.csv' AS row FIELDTERMINATOR ';'
      WITH row
      WHERE row[0] IS NOT null
      UNWIND RANGE(0, size(row) - 1) AS columnNumber
      WITH row, columnNumber
      MERGE (a:schedule {
        IDSch: row[0],
        departure_date:
        
        
CASE WHEN row[1] IS null THEN 'null' ELSE row[1] END,
        departure_time:
        
        
CASE WHEN size(row) > 2 THEN row[2] ELSE '' END
        
        })
        RETURN a.IDSch, a.departure_date, a.departure_time;
        
//relation
//bus-(:has_seat)->seat
        LOAD CSV FROM 'file: ///bus-seat.csv' AS row FIELDTERMINATOR ';'
        WITH row
        WHERE row[0] IS NOT null AND row[1] IS NOT null
        MATCH (a:bus { IDBus: row[0] }), (b:seat {IDSeat: row[1]})
        CREATE (a)-[:has_seat]->(b);
        
//bus-(:has_schedule)->schedule
        LOAD CSV FROM 'file: ///bus-schedule.csv' AS row FIELDTERMINATOR ';'
        WITH row
        WHERE row[0] IS NOT null AND row[1] IS NOT null
        MATCH (a:bus { IDBus: row[0] }), (b:schedule {IDSch: row[1]})
        CREATE (a)-[:has_schedule]->(b);
        
//bus-(:depart_from)->stop
        LOAD CSV FROM 'file: ///bus-depart-from.csv' AS row FIELDTERMINATOR ';'
        WITH row
        WHERE row[0] IS NOT null AND row[1] IS NOT null
        MATCH (a:bus { IDBus: row[0] }), (b:stop {IDStop: row[1]})
        CREATE (a)-[:depart_from]->(b);
        
//bus-(:arrive_at)->stop
        LOAD CSV FROM 'file: ///bus-arrive-at.csv' AS row FIELDTERMINATOR ';'
        WITH row
        WHERE row[0] IS NOT null AND row[1] IS NOT null
        MATCH (a:bus { IDBus: row[0] }), (b:stop {IDStop: row[1]})
        CREATE (a)-[:arrive_at]->(b);
        
//schedule-(:has_stop)->stop
        LOAD CSV FROM 'file: ///shedule-stop.csv' AS row FIELDTERMINATOR ';'
        WITH row
        WHERE row[0] IS NOT null AND row[1] IS NOT null
        MATCH (a:schedule { IDSch: row[0] }), (b:stop {IDStop: row[1]})
        CREATE (a)-[:has_stop]->(b);
