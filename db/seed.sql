TRUNCATE TABLE operators,
monitors,
checks,
incidents RESTART IDENTITY CASCADE;

INSERT INTO
    operators (email, password_hash, created_at)
VALUES
    (
        'kbrand@gmail.com',
        '$2b$10$mellpYbgMi76ecNPDYwojeiRJfw.zg6.PsVY4MNc/eNObzb0U3zBG',
        NOW () - INTERVAL '45 days'
    ),
    (
        'admin@pulse.io',
        '$2a$10$7Z2hPClD5SPhS.9gM4uO6ex7O/V43M9R660P2uG.YV.fPsm8WnS6C',
        NOW () - INTERVAL '40 days'
    ),
    (
        'maria@pulse.io',
        '$2b$10$HaEwPwQ1IYcFX1v1k0Q57uTcM46Cj7h0lHb2Yc4G7f/9xg7Tt1ZrS',
        NOW () - INTERVAL '35 days'
    ),
    (
        'david@acme.dev',
        '$2b$10$7Z2hPClD5SPhS.9gM4uO6ex7O/V43M9R660P2uG.YV.fPsm8WnS6C',
        NOW () - INTERVAL '30 days'
    ),
    (
        'sarah@northstar.io',
        '$2b$10$mellpYbgMi76ecNPDYwojeiRJfw.zg6.PsVY4MNc/eNObzb0U3zBG',
        NOW () - INTERVAL '25 days'
    );

INSERT INTO
    monitors (
        operator_id,
        name,
        url,
        interval_seconds,
        expected_status,
        is_active,
        created_at
    )
VALUES
    (
        1,
        'Google',
        'https://www.google.com',
        30,
        200,
        true,
        NOW () - INTERVAL '45 days'
    ),
    (
        1,
        'Tiktok',
        'https://www.tiktok.com',
        60,
        200,
        true,
        NOW () - INTERVAL '44 days'
    ),
    (
        1,
        'Facebook Feed',
        'https://www.facebook.com',
        120,
        200,
        true,
        NOW () - INTERVAL '43 days'
    ),
    (
        2,
        'Amazon Sales Service',
        'https://www.amazon.com',
        45,
        200,
        true,
        NOW () - INTERVAL '40 days'
    ),
    (
        2,
        'MTN Service',
        'https://www.mtn.com',
        60,
        200,
        true,
        NOW () - INTERVAL '39 days'
    ),
    (
        3,
        'Cameroon MTN Service',
        'https://www.mtn.cm',
        90,
        200,
        true,
        NOW () - INTERVAL '35 days'
    ),
    (
        4,
        'ChatGPT AI agent',
        'https://chatgpt.com',
        300,
        200,
        false,
        NOW () - INTERVAL '30 days'
    ),
    (
        5,
        'Instagram',
        'https://www.instagram.com',
        60,
        200,
        true,
        NOW () - INTERVAL '25 days'
    );

INSERT INTO
    checks (
        monitor_id,
        checked_at,
        ok,
        status_code,
        latency_ms,
        error
    )
VALUES
    (
        1,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        42,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        39,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '16 hours',
        true,
        200,
        51,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '12 hours',
        true,
        200,
        47,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '8 hours',
        true,
        200,
        43,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '4 hours',
        true,
        200,
        55,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '2 hours',
        true,
        200,
        46,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        44,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '45 mins',
        true,
        200,
        41,
        NULL
    ),
    (
        1,
        NOW () - INTERVAL '15 mins',
        true,
        200,
        40,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        118,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        122,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '16 hours',
        true,
        200,
        129,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '12 hours',
        true,
        200,
        108,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '8 hours',
        false,
        503,
        5000,
        'Service Unavailable'
    ),
    (
        2,
        NOW () - INTERVAL '6 hours',
        false,
        503,
        5000,
        'Service Unavailable'
    ),
    (
        2,
        NOW () - INTERVAL '4 hours',
        false,
        502,
        3200,
        'Bad Gateway'
    ),
    (
        2,
        NOW () - INTERVAL '3 hours',
        true,
        200,
        126,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        110,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '30 mins',
        true,
        200,
        118,
        NULL
    ),
    (
        2,
        NOW () - INTERVAL '10 mins',
        true,
        200,
        108,
        NULL
    ),
    (
        3,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        88,
        NULL
    ),
    (
        3,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        84,
        NULL
    ),
    (
        3,
        NOW () - INTERVAL '16 hours',
        true,
        200,
        90,
        NULL
    ),
    (
        3,
        NOW () - INTERVAL '12 hours',
        true,
        200,
        79,
        NULL
    ),
    (
        3,
        NOW () - INTERVAL '8 hours',
        true,
        200,
        82,
        NULL
    ),
    (
        3,
        NOW () - INTERVAL '4 hours',
        false,
        500,
        250,
        'Internal Server Error'
    ),
    (
        3,
        NOW () - INTERVAL '3 hours',
        false,
        500,
        260,
        'Internal Server Error'
    ),
    (
        3,
        NOW () - INTERVAL '2 hours',
        false,
        500,
        240,
        'Internal Server Error'
    ),
    (
        3,
        NOW () - INTERVAL '1 hour',
        false,
        500,
        270,
        'Internal Server Error'
    ),
    (
        3,
        NOW () - INTERVAL '15 mins',
        false,
        500,
        250,
        'Internal Server Error'
    ),
    (
        4,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        15,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        18,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '16 hours',
        false,
        504,
        4000,
        'Gateway Timeout'
    ),
    (
        4,
        NOW () - INTERVAL '12 hours',
        true,
        200,
        16,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '8 hours',
        true,
        200,
        19,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '4 hours',
        false,
        502,
        3000,
        'Bad Gateway'
    ),
    (
        4,
        NOW () - INTERVAL '2 hours',
        true,
        200,
        17,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        15,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '45 mins',
        true,
        200,
        18,
        NULL
    ),
    (
        4,
        NOW () - INTERVAL '10 mins',
        true,
        200,
        16,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        240,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        230,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '16 hours',
        true,
        200,
        248,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '12 hours',
        true,
        200,
        235,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '8 hours',
        true,
        200,
        242,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '4 hours',
        true,
        200,
        255,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '2 hours',
        true,
        200,
        248,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        238,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '45 mins',
        true,
        200,
        244,
        NULL
    ),
    (
        5,
        NOW () - INTERVAL '10 mins',
        true,
        200,
        242,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        62,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        58,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '16 hours',
        false,
        401,
        1800,
        'Unauthorized'
    ),
    (
        6,
        NOW () - INTERVAL '12 hours',
        false,
        401,
        1850,
        'Unauthorized'
    ),
    (
        6,
        NOW () - INTERVAL '8 hours',
        true,
        200,
        60,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '4 hours',
        true,
        200,
        64,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '2 hours',
        true,
        200,
        63,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        61,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '45 mins',
        true,
        200,
        59,
        NULL
    ),
    (
        6,
        NOW () - INTERVAL '10 mins',
        true,
        200,
        62,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        78,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        82,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '16 hours',
        true,
        200,
        81,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '12 hours',
        true,
        200,
        79,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '8 hours',
        true,
        200,
        80,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '4 hours',
        true,
        200,
        77,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '2 hours',
        true,
        200,
        76,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        75,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '45 mins',
        true,
        200,
        78,
        NULL
    ),
    (
        7,
        NOW () - INTERVAL '10 mins',
        true,
        200,
        74,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '24 hours',
        true,
        200,
        145,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '20 hours',
        true,
        200,
        150,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '16 hours',
        true,
        200,
        148,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '12 hours',
        false,
        503,
        4000,
        'Service Unavailable'
    ),
    (
        8,
        NOW () - INTERVAL '8 hours',
        false,
        503,
        4100,
        'Service Unavailable'
    ),
    (
        8,
        NOW () - INTERVAL '4 hours',
        true,
        200,
        142,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '2 hours',
        true,
        200,
        140,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '90 mins',
        true,
        200,
        144,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '45 mins',
        true,
        200,
        139,
        NULL
    ),
    (
        8,
        NOW () - INTERVAL '10 mins',
        true,
        200,
        141,
        NULL
    );

INSERT INTO
    incidents (monitor_id, started_at, resolved_at, cause)
VALUES
    (
        2,
        NOW () - INTERVAL '8 hours',
        NOW () - INTERVAL '3 hours',
        'Website returned status 503 Service Unavailable'
    ),
    (
        3,
        NOW () - INTERVAL '4 hours',
        NULL,
        'Website returned status 500 Internal Server Error'
    ),
    (
        4,
        NOW () - INTERVAL '6 hours',
        NOW () - INTERVAL '2 hours',
        'Gateway timed out while processing analytics requests'
    ),
    (
        6,
        NOW () - INTERVAL '16 hours',
        NOW () - INTERVAL '8 hours',
        'Authentication flow returned 401 Unauthorized'
    ),
    (
        8,
        NOW () - INTERVAL '12 hours',
        NOW () - INTERVAL '4 hours',
        'Checkout service returned 503 Service Unavailable'
    );