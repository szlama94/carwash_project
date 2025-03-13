<?php

$_POST['data'] = '{
    "user_id": 73,
    "booking_date": "2025-03-27",
    "vehicle_plate": "qqqq",
    "services": [
        {
            "time": "09:00:00",
            "service_id": 3
        },
        {
            "time": "10:00:00",
            "service_id": 6
        },
        {
            "time": "13:00:00",
            "service_id": 5
        },
        {
            "time": "14:00:00",
            "service_id": 11
        },
        {
            "time": "15:00:00",
            "service_id": 12
        },
        {
            "time": "17:00:00",
            "service_id": 10
        }
    ]
}';
require_once('./save_booking.php');