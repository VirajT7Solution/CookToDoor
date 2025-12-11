# PlateMate Backend

Spring Boot backend application for the PlateMate food delivery system.

## Prerequisites

- **Java 21 JDK** (Required)
- **PostgreSQL** database (running on localhost:5432)
- **Spring Tool Suite 4 (STS4)** or any Java IDE with Maven support
- **Maven** (included via Maven Wrapper)

## Quick Start

### 1. Install Java 21

See [SETUP_JAVA21.md](./SETUP_JAVA21.md) for detailed installation instructions.

### 2. Verify Setup

Run the verification script:

```powershell
.\verify-setup.ps1
```

### 3. Setup in STS4

Follow the complete guide: [STS4_SETUP_GUIDE.md](./STS4_SETUP_GUIDE.md)

### Quick Setup Steps:

1. **Import Project**: File → Import → Maven → Existing Maven Projects
2. **Configure Java 21**: Window → Preferences → Java → Installed JREs
3. **Update Maven**: Right-click project → Maven → Update Project
4. **Build**: Right-click project → Maven → Install
5. **Run**: Right-click `PlateMateApplication.java` → Run As → Spring Boot App

## Database Configuration

The application is configured to use PostgreSQL. Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/platemate
spring.datasource.username=postgres
spring.datasource.password=aa@123
```

**Note**: Ensure PostgreSQL is running and the `platemate` database exists (or will be auto-created with `ddl-auto=update`).

## Project Structure

```
platemate-backend/
├── src/
│   ├── main/
│   │   ├── java/com/platemate/
│   │   │   ├── PlateMateApplication.java    # Main application class
│   │   │   ├── controller/                  # REST controllers
│   │   │   ├── service/                     # Business logic
│   │   │   ├── repository/                  # Data access layer
│   │   │   ├── model/                       # Entity classes
│   │   │   ├── dto/                         # Data transfer objects
│   │   │   ├── config/                      # Configuration classes
│   │   │   └── exception/                   # Exception handlers
│   │   └── resources/
│   │       └── application.properties       # Application configuration
│   └── test/
├── target/                                   # Build output
├── pom.xml                                   # Maven configuration
├── mvnw.cmd                                  # Maven wrapper (Windows)
└── mvnw                                      # Maven wrapper (Unix)
```

## Building the Project

### Using Maven Wrapper (Command Line)

```powershell
# Clean and compile
.\mvnw.cmd clean compile

# Clean, compile, and package
.\mvnw.cmd clean install

# Run the application
.\mvnw.cmd spring-boot:run
```

### Using STS4

- **Clean**: Right-click project → Maven → Clean
- **Build**: Right-click project → Maven → Install
- **Run**: Right-click `PlateMateApplication.java` → Run As → Spring Boot App

## Running the Application

### Method 1: STS4 (Recommended)

1. Right-click `src/main/java/com/platemate/PlateMateApplication.java`
2. Select **Run As → Spring Boot App**

### Method 2: Maven Goal

1. Right-click project → **Run As → Maven Build...**
2. Goals: `spring-boot:run`
3. Click **Run**

### Method 3: Command Line

```powershell
.\mvnw.cmd spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

The application provides REST APIs for:

- Authentication (`/api/auth/*`)
- User management (`/api/users/*`)
- Tiffin providers (`/api/provider/*`)
- Customers (`/api/customer/*`)
- Menu items (`/api/menu-items/*`)
- Orders (`/api/orders/*`)
- Payments (`/api/payments/*`)
- And more...

## Configuration

### Database

- **Type**: PostgreSQL
- **Auto-create tables**: Yes (`spring.jpa.hibernate.ddl-auto=update`)
- **Show SQL**: Yes (for debugging)

### Security

- JWT-based authentication
- Spring Security configured
- Custom security filters

### File Upload

- Max file size: 10MB
- Max request size: 10MB

## Troubleshooting

### "Could not find or load main class"

1. Build the project: **Maven → Install**
2. Verify `target/classes/com/platemate/PlateMateApplication.class` exists
3. Refresh project: Right-click → **Refresh** (F5)

### "release version 21 not supported"

1. Install Java 21 (see [SETUP_JAVA21.md](./SETUP_JAVA21.md))
2. Configure Java 21 in STS4
3. Set project to use Java 21

### Database connection failed

1. Ensure PostgreSQL is running
2. Verify database credentials in `application.properties`
3. Check if database `platemate` exists

### Maven dependencies not downloading

1. Check internet connection
2. Update Maven project: **Maven → Update Project** (with Force Update)
3. Check Maven settings in STS4 preferences

## Documentation

- [Java 21 Installation Guide](./SETUP_JAVA21.md)
- [STS4 Setup Guide](./STS4_SETUP_GUIDE.md)
- [Verification Script](./verify-setup.ps1)

## Technology Stack

- **Framework**: Spring Boot 3.5.6
- **Java Version**: 21
- **Build Tool**: Maven
- **Database**: PostgreSQL
- **Security**: Spring Security + JWT
- **Payment**: Razorpay integration

## Development

### Adding Dependencies

Edit `pom.xml` and add dependencies in the `<dependencies>` section.

### Database Changes

1. Modify entity classes in `src/main/java/com/platemate/model/`
2. With `ddl-auto=update`, tables will be auto-updated on startup
3. For production, use migrations (Flyway/Liquibase)

### Running Tests

```powershell
.\mvnw.cmd test
```

## License

[Add your license information here]

## Support

For issues and questions, please refer to the setup guides or check the troubleshooting section.
