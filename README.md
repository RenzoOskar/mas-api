# Documentación de Uso - API de Agendamiento Médico

## Descripción
API para agendar citas médicas en Perú (PE) y Chile (CL). Permite crear citas y consultar el estado de las mismas.

---

## Endpoints

### 1. Crear cita (POST `/appointment`)

- **URL:**  
    `https://931km0zcg4.execute-api.us-east-1.amazonaws.com/dev/appointment`

- **Descripción:**  
    Envía una solicitud para agendar una cita. Los datos se guardan en la base de datos correspondiente según el país (`PE` o `CL`). Luego, se envía una confirmación que actualiza el estado a `"COMPLETED"`.

- **Headers:**  
    No requiere autenticación (para propósitos de prueba).

- **Body (JSON):**

    ```json
    {
    "insuredId": "1064",
    "scheduleId": 211,
    "countryISO": "CL"
    }
    ```

- **Validaciones:**  
  - `countryISO` debe ser `"PE"` o `"CL"`.  
  - Si se envía otro valor, responde con error 400 y mensaje:  
    ```json
    {
      "message": "Request inválido"
    }
    ```

- **Respuesta exitosa:**

    ```json
    {
    "msg": "El agendamiento esta en proceso"
    }

### 2. Consultar citas por asegurado (GET `/appointments/{insuredId}`)

- **URL:**  
    `https://931km0zcg4.execute-api.us-east-1.amazonaws.com/dev/appointments/{insuredId}`

- **Descripción:**  
    Permite consultar todas las citas asociadas al asegurado especificado por `insuredId`.

- **Parámetros de ruta:**
  - `insuredId` (string): ID del asegurado.

- **Headers:**  
    No requiere autenticación (para propósitos de prueba).

- **Respuesta exitosa:**

    ```json
    {
      "msg": {
        "data": [
          {
            "scheduleId": 211,
            "insuredId": "1064",
            "countryISO": "CL",
            "status": "COMPLETED"
          }
        ]
      }
    }
    ```

- **Respuesta si no se encuentran citas:**

    ```json
    {
      "message": "No se encontraron citas"
    }
    ```

## Cómo probar

Puedes usar herramientas como **Postman** o **curl** para interactuar con la API.

## Notas

- Actualmente no se implementa autenticación, pero se asume que estará presente en entornos productivos.
- La infraestructura utiliza dos colas SQS y dos lambdas separadas para manejar lógica específica por país (CL y PE).
- Cada país tiene una tabla dedicada en RDS para mantener la separación de datos y simular que son dos servidores distintos.
- Una vez creada la cita, se dispara un evento que actualiza el estado a `"COMPLETED"`.
