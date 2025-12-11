# PlateMate - Home Made Food Delivery System

## Project Documentation

---

## 1. Introduction

### 1.1 Project Overview

**PlateMate** is a comprehensive home-made food delivery system designed to connect customers with local food providers (tiffin providers) and delivery partners. The platform facilitates the entire food delivery ecosystem, from menu browsing and order placement to payment processing and delivery tracking.

The system consists of three main components:

- **Backend API**: A robust Spring Boot REST API that handles all business logic, authentication, and data management
- **Android Mobile Application**: A native Android app that provides an intuitive interface for customers, providers, and delivery partners
- **Admin Web Panel**: A web-based administrative interface for managing users, providers, orders, and system configurations

PlateMate addresses the growing demand for home-cooked, authentic food delivery services by creating a seamless platform where local food providers can showcase their offerings, customers can discover and order meals, and delivery partners can efficiently manage deliveries.

### 1.2 Objectives

The primary objectives of the PlateMate project are:

1. **Connect Local Food Providers with Customers**: Enable home-based food businesses (tiffin providers) to reach a wider customer base through a digital platform

2. **Streamline Order Management**: Provide an efficient system for order processing, tracking, and fulfillment from placement to delivery

3. **Ensure Secure Transactions**: Implement secure payment processing using Razorpay integration for seamless and safe financial transactions

4. **Enable Multi-Role Functionality**: Support four distinct user roles (Customer, Provider, Delivery Partner, Admin) with role-specific features and permissions

5. **Provide Real-Time Order Tracking**: Allow customers to track their orders in real-time from preparation to delivery

6. **Facilitate Provider Management**: Enable providers to manage their menu items, receive orders, and update order statuses efficiently

7. **Optimize Delivery Operations**: Help delivery partners manage their assigned orders and delivery routes effectively

8. **Admin Oversight**: Provide comprehensive administrative tools for user management, provider verification, and system monitoring

### 1.3 Scope

The scope of the PlateMate project encompasses:

#### Functional Scope:

- **User Management**: Registration, authentication, and profile management for all user types
- **Provider Management**: Provider registration, verification, and profile management
- **Menu Management**: CRUD operations for menu items with categories, pricing, and availability
- **Order Management**: Complete order lifecycle from creation to delivery completion
- **Cart Management**: Shopping cart functionality with add, update, and remove operations
- **Payment Integration**: Secure payment processing using Razorpay payment gateway
- **Delivery Management**: Assignment of delivery partners, order tracking, and status updates
- **Address Management**: Multiple address support for customers with delivery zone validation
- **Rating and Reviews**: Customer feedback system for providers and menu items
- **Admin Dashboard**: Comprehensive administrative interface for system management

#### Technical Scope:

- **Backend Development**: RESTful API development using Spring Boot framework
- **Mobile Application**: Native Android application development using Java
- **Database Design**: PostgreSQL database with proper schema design and relationships
- **Authentication & Authorization**: JWT-based security implementation with role-based access control
- **API Integration**: Third-party payment gateway integration (Razorpay)
- **File Upload**: Image handling for menu items and user profiles

#### Out of Scope (Future Enhancements):

- Real-time chat functionality between users
- Push notifications for order updates
- Advanced analytics and reporting
- Multi-language support
- iOS mobile application
- Web-based customer interface

### 1.4 Technologies Used

#### Backend Technologies:

- **Framework**: Spring Boot 3.5.6
- **Programming Language**: Java 21
- **Build Tool**: Apache Maven
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **API Documentation**: RESTful API design
- **Email Service**: Spring Mail Starter
- **Validation**: Spring Boot Validation Starter

#### Android Application Technologies:

- **Platform**: Android (Native)
- **Programming Language**: Java 11
- **Minimum SDK**: Android API 24 (Android 7.0)
- **Target SDK**: Android API 36
- **Build System**: Gradle (Kotlin DSL)
- **UI Framework**: Android Material Design Components
- **Networking**: Retrofit 3.0.0 with Gson Converter
- **Image Loading**: Glide 4.16.0
- **Payment SDK**: Razorpay Checkout 1.6.33
- **UI Components**:
  - AppCompat
  - Material Design Components
  - RecyclerView
  - CardView
  - ConstraintLayout
  - SwipeRefreshLayout

#### Database:

- **Database System**: PostgreSQL
- **Connection**: JDBC
- **Schema Management**: Hibernate DDL Auto Update

#### Development Tools:

- **IDE**: Spring Tool Suite 4 (STS4) / Android Studio
- **Version Control**: Git
- **API Testing**: Postman
- **Build Tools**: Maven Wrapper, Gradle Wrapper

#### Third-Party Services:

- **Payment Gateway**: Razorpay
- **Email Service**: SMTP (via Spring Mail)

---

## 2. System Analysis

### 2.1 Existing System

The current food delivery ecosystem is dominated by large-scale platforms that primarily focus on restaurant partnerships and commercial food establishments. The existing systems have several characteristics and limitations:

#### Current Market Landscape:

- **Large Platform Dominance**: Major food delivery platforms (Swiggy, Zomato, Uber Eats) focus primarily on established restaurants and commercial food chains
- **Limited Home-Based Business Access**: Home-based food providers (tiffin services, home chefs) face significant barriers to entry due to high commission rates, strict verification processes, and platform requirements
- **Manual Order Management**: Many small-scale food providers rely on phone calls, WhatsApp, or basic social media for order management, leading to inefficiencies
- **Payment Challenges**: Cash-based transactions and lack of secure digital payment options create trust and convenience issues
- **No Centralized Platform**: Home-based food providers operate in isolation without a unified platform to showcase their offerings
- **Limited Customer Discovery**: Customers struggle to discover authentic home-cooked meals in their locality
- **Delivery Coordination Issues**: Unorganized delivery management leads to delays and poor customer experience

#### Limitations of Existing Systems:

1. **High Entry Barriers**: Commercial platforms require business licenses, GST registration, and high commission fees that are prohibitive for home-based providers
2. **Lack of Specialization**: Existing platforms are not optimized for home-made food businesses with their unique requirements
3. **Limited Provider Control**: Providers have minimal control over their listings, pricing, and customer interactions
4. **Inadequate Verification**: No proper verification system for home-based providers, leading to quality concerns
5. **Fragmented Experience**: Customers must use multiple platforms or direct contact methods to access different providers
6. **No Delivery Partner Integration**: Lack of dedicated delivery partner management for home food delivery
7. **Limited Customization**: Rigid platform structures that don't accommodate the flexible nature of home-based food businesses

### 2.2 Proposed System

**PlateMate** is a specialized food delivery platform designed specifically for home-made food businesses, addressing the unique needs of tiffin providers, home chefs, and customers seeking authentic home-cooked meals.

#### Key Features of Proposed System:

**1. Provider-Centric Platform**

- Dedicated registration and profile management for home-based food providers
- Admin verification system to ensure quality and authenticity
- Flexible menu management with categories, meal types, and availability settings
- Provider dashboard for order management and status updates

**2. Multi-Role Architecture**

- **Customer Role**: Browse menus, manage cart, place orders, track deliveries, make payments
- **Provider Role**: Manage profile, create/update menu items, process orders, update order status
- **Delivery Partner Role**: View assigned orders, update delivery status, manage routes
- **Admin Role**: Verify providers, manage users, assign delivery partners, system oversight

**3. Comprehensive Order Management**

- Complete order lifecycle from creation to delivery
- Real-time order status tracking
- Automated order assignment to delivery partners
- Order history and analytics

**4. Secure Payment Integration**

- Razorpay payment gateway integration for secure transactions
- Multiple payment methods support
- Payment verification and order confirmation
- Transaction history and receipts

**5. Delivery Zone Management**

- Geographic delivery zone definition
- Address validation against delivery zones
- Efficient delivery partner assignment based on zones

**6. User-Friendly Mobile Application**

- Native Android application with intuitive UI/UX
- Material Design components for modern interface
- Offline capability for browsing menus
- Push notifications for order updates (future enhancement)

**7. Admin Web Panel**

- Comprehensive administrative dashboard
- Provider verification and approval workflow
- User management and monitoring
- System configuration and analytics

**8. Rating and Review System**

- Customer feedback mechanism for providers and menu items
- Quality assurance through reviews
- Provider reputation building

#### Advantages of Proposed System:

1. **Lower Entry Barriers**: Simplified registration process specifically designed for home-based providers
2. **Specialized Platform**: Built specifically for home-made food businesses with tailored features
3. **Provider Empowerment**: Full control over menu, pricing, and availability
4. **Quality Assurance**: Admin verification ensures only legitimate providers are onboarded
5. **Unified Experience**: Single platform for customers to discover and order from multiple home-based providers
6. **Integrated Delivery**: Seamless delivery partner management and assignment
7. **Secure Transactions**: Digital payment integration ensures safe and convenient transactions
8. **Scalability**: Architecture designed to handle growth in users, providers, and orders
9. **Mobile-First Approach**: Native Android app provides optimal user experience
10. **Real-Time Tracking**: Order status updates keep all stakeholders informed

### 2.3 Problem Statement

The food delivery market lacks a specialized platform that effectively serves home-based food providers (tiffin services, home chefs) and connects them with customers seeking authentic, home-cooked meals. The existing problems can be categorized as follows:

#### Problem 1: Limited Market Access for Home-Based Providers

**Issue**: Home-based food providers struggle to reach customers due to:

- High commission fees (20-30%) charged by commercial platforms
- Strict business requirements (GST, licenses) that many home providers cannot meet
- Platform policies that favor established restaurants over small-scale providers
- Lack of visibility in search results and recommendations

**Impact**: Many talented home chefs and tiffin providers remain undiscovered, limiting their income potential and customer reach.

#### Problem 2: Fragmented Order Management

**Issue**: Home-based providers rely on manual methods for order management:

- Phone calls and WhatsApp messages for order taking
- Manual record keeping leading to errors and missed orders
- No systematic way to track order status and delivery
- Difficulty managing multiple orders simultaneously

**Impact**: Inefficient operations, order errors, poor customer experience, and limited scalability.

#### Problem 3: Payment and Trust Issues

**Issue**: Current payment methods create barriers:

- Cash-based transactions raise safety and convenience concerns
- Lack of secure digital payment options
- No payment verification system
- Trust issues between customers and providers

**Impact**: Reduced customer confidence, limited transaction volume, and security concerns.

#### Problem 4: Customer Discovery Challenges

**Issue**: Customers face difficulties finding home-made food options:

- No centralized platform to discover local home-based providers
- Reliance on word-of-mouth or social media, which is unreliable
- Difficulty comparing options, prices, and reviews
- No easy way to place orders from multiple providers

**Impact**: Limited customer access to authentic home-cooked meals, reduced provider revenue.

#### Problem 5: Delivery Coordination Problems

**Issue**: Unorganized delivery management:

- No systematic delivery partner assignment
- Lack of real-time tracking for customers
- Inefficient route management
- Poor communication between providers, delivery partners, and customers

**Impact**: Delayed deliveries, poor customer satisfaction, and operational inefficiencies.

#### Problem 6: Quality and Verification Concerns

**Issue**: Lack of proper verification and quality assurance:

- No standardized verification process for home-based providers
- Difficulty ensuring food safety and quality
- Limited customer feedback mechanisms
- No reputation system for providers

**Impact**: Customer safety concerns, reduced trust, and potential quality issues.

#### Solution Approach:

PlateMate addresses these problems by providing:

1. **Specialized Platform**: A dedicated platform designed specifically for home-based food providers with lower barriers to entry
2. **Automated Order Management**: Digital order processing, tracking, and management system
3. **Secure Payment Gateway**: Integrated Razorpay payment system for safe and convenient transactions
4. **Centralized Discovery**: Unified platform for customers to discover, compare, and order from multiple providers
5. **Delivery Management System**: Automated delivery partner assignment and real-time tracking
6. **Verification and Quality Control**: Admin verification process and rating/review system to ensure quality

The proposed system creates a win-win ecosystem where home-based providers can grow their business, customers can easily access authentic home-cooked meals, delivery partners can efficiently manage deliveries, and administrators can maintain platform quality and operations.

---

## 3. Requirements

### 3.1 Hardware Requirements

#### 3.1.1 Development Environment Hardware

**Backend Development:**

- **Processor**: Intel Core i5 (6th generation) or equivalent / AMD Ryzen 5 or better
- **RAM**: Minimum 8 GB, Recommended 16 GB or higher
- **Storage**: Minimum 20 GB free disk space for:
  - Java Development Kit (JDK)
  - Spring Tool Suite (STS4) or IntelliJ IDEA
  - Maven dependencies and build artifacts
  - PostgreSQL database
  - Project source code
- **Network**: Stable internet connection for:
  - Downloading Maven dependencies
  - Accessing PostgreSQL database
  - Testing API endpoints
  - Payment gateway integration testing

**Android Development:**

- **Processor**: Intel Core i5 (6th generation) or equivalent / AMD Ryzen 5 or better
- **RAM**: Minimum 8 GB, Recommended 16 GB or higher (Android Studio is resource-intensive)
- **Storage**: Minimum 30 GB free disk space for:
  - Android Studio IDE
  - Android SDK and platform tools
  - Android Virtual Device (AVD) emulator images
  - Gradle dependencies and build cache
  - Project source code and compiled APKs
- **Graphics**: Hardware acceleration support for Android Emulator (recommended)
- **Network**: Stable internet connection for:
  - Downloading Android SDK components
  - Gradle dependency downloads
  - Testing API integration

**Server/Production Environment:**

- **Processor**: Multi-core processor (2+ cores recommended)
- **RAM**: Minimum 4 GB, Recommended 8 GB or higher for production
- **Storage**: Minimum 50 GB SSD storage for:
  - Application deployment
  - PostgreSQL database and backups
  - Log files
  - Image storage (menu items, user profiles)
- **Network**: High-speed internet connection with static IP (for production)
- **Backup Storage**: Additional storage for database backups and logs

#### 3.1.2 Client Device Requirements (Android Application)

**Minimum Requirements:**

- **Device**: Android smartphone or tablet
- **Operating System**: Android 7.0 (API Level 24) or higher
- **RAM**: Minimum 2 GB
- **Storage**: Minimum 100 MB free space for app installation
- **Network**:
  - Wi-Fi or mobile data connection (3G/4G/5G)
  - Internet connectivity required for:
    - User authentication
    - Browsing menu items
    - Placing orders
    - Payment processing
    - Order tracking
- **Screen Resolution**: Minimum 480x800 pixels
- **Camera**: Optional (for profile picture upload)
- **GPS/Location Services**: Required for delivery address selection and tracking

**Recommended Requirements:**

- **Operating System**: Android 10.0 (API Level 29) or higher
- **RAM**: 4 GB or higher
- **Storage**: 500 MB or more free space
- **Screen Resolution**: 720p (1280x720) or higher for better UI experience
- **Network**: 4G/5G connection for faster data loading

**Admin Web Panel:**

- **Device**: Desktop, laptop, or tablet
- **Browser**:
  - Google Chrome (latest version) - Recommended
  - Mozilla Firefox (latest version)
  - Microsoft Edge (latest version)
  - Safari (latest version) - for macOS
- **Screen Resolution**: Minimum 1366x768 pixels
- **Network**: Stable internet connection

### 3.2 Software Requirements

#### 3.2.1 Backend Development Software

**Operating System:**

- Windows 10/11 (64-bit)
- macOS 10.15 or later
- Linux (Ubuntu 20.04 LTS or later, Fedora, CentOS)

**Java Development Kit (JDK):**

- **Version**: Java 21 (LTS - Long Term Support)
- **Distribution Options**:
  - Eclipse Adoptium (Temurin) - Recommended
  - Oracle JDK 21
  - OpenJDK 21
- **Installation Path**: Should be added to system PATH
- **JAVA_HOME**: Environment variable must be configured

**Build Tool:**

- **Maven**: Version 3.6.3 or higher
- **Maven Wrapper**: Included in project (mvnw / mvnw.cmd)
- **Maven Repository**: Access to Maven Central Repository (via internet)

**Integrated Development Environment (IDE):**

- **Spring Tool Suite 4 (STS4)** - Recommended for Spring Boot development
  - Based on Eclipse IDE
  - Includes Spring Boot support
  - Maven integration
- **IntelliJ IDEA** (Community or Ultimate Edition)
  - Excellent Spring Boot support
  - Built-in Maven support
- **Eclipse IDE for Enterprise Java and Web Developers**
  - With Spring Tools plugin
- **Visual Studio Code** (with Java extensions)

**Database:**

- **PostgreSQL**: Version 12 or higher (Recommended: Version 14 or 15)
- **Database Server**: Running on localhost:5432 (default) or remote server
- **Database Management Tools** (Optional):
  - pgAdmin 4
  - DBeaver
  - DataGrip
  - PostgreSQL command-line tools (psql)

**Application Server:**

- **Embedded Tomcat**: Included with Spring Boot (no separate installation required)
- **Port**: 8080 (default, configurable)

**Version Control:**

- **Git**: Version 2.30 or higher
- **Git Client**:
  - Git Bash (command line)
  - GitHub Desktop
  - SourceTree
  - GitKraken

**API Testing Tools:**

- **Postman**: For testing REST API endpoints
- **cURL**: Command-line tool for API testing
- **REST Client Extensions**: For VS Code or other IDEs

**Other Tools:**

- **Text Editor**: For configuration files (Notepad++, VS Code, etc.)
- **Terminal/Command Prompt**: For running Maven commands
- **PowerShell** (Windows) or **Bash** (Linux/macOS)

#### 3.2.2 Android Development Software

**Operating System:**

- Windows 10/11 (64-bit)
- macOS 10.15 or later
- Linux (Ubuntu 18.04 LTS or later)

**Java Development Kit (JDK):**

- **Version**: Java 11 (for Android development)
- **Distribution**: Oracle JDK 11 or OpenJDK 11
- **Note**: Android Studio includes bundled JDK, but system JDK can be used

**Android Development Environment:**

- **Android Studio**: Latest stable version (Hedgehog, Iguana, or newer)
  - Includes Android SDK
  - Android SDK Platform Tools
  - Android Emulator
  - Gradle build system
- **Android SDK**:
  - Minimum SDK: API Level 24 (Android 7.0)
  - Target SDK: API Level 36
  - Compile SDK: API Level 36
  - Android SDK Build Tools
  - Android Support Libraries

**Build System:**

- **Gradle**: Version 8.0 or higher (managed by Gradle Wrapper)
- **Gradle Wrapper**: Included in project (gradlew / gradlew.bat)
- **Kotlin DSL**: For Gradle build scripts

**Android Virtual Device (AVD):**

- **Emulator**: Android Emulator (included with Android Studio)
- **System Images**:
  - Android 7.0 (API 24) or higher
  - Recommended: Android 10.0+ (API 29+) for testing
- **Hardware Acceleration**:
  - Intel HAXM (for Intel processors)
  - Android Emulator Hypervisor Driver (for AMD processors)

**Version Control:**

- **Git**: Version 2.30 or higher
- **Git Client**: Same as backend requirements

**Testing Tools:**

- **Android Debug Bridge (ADB)**: Included with Android SDK
- **Physical Android Device**: For real device testing (optional but recommended)
- **USB Debugging**: Enabled on physical devices

#### 3.2.3 Database Software

**Database Management System:**

- **PostgreSQL**: Version 12 or higher
  - Server installation required
  - Client tools for database management
  - PostgreSQL JDBC Driver (included in Maven dependencies)

**Database Configuration:**

- **Database Name**: platemate (configurable)
- **Port**: 5432 (default)
- **User**: postgres (default, configurable)
- **Password**: Configurable in application.properties
- **Character Encoding**: UTF-8

**Database Tools:**

- **pgAdmin 4**: Graphical database administration tool
- **DBeaver**: Universal database tool
- **psql**: Command-line PostgreSQL client
- **DataGrip**: JetBrains database IDE

#### 3.2.4 Third-Party Services and APIs

**Payment Gateway:**

- **Razorpay Account**:

  - Test account for development
  - Production account for deployment
  - API Keys (Key ID and Key Secret)
  - Webhook configuration

- **Razorpay SDK**:
  - Backend: Razorpay Java SDK (via Maven)
  - Android: Razorpay Checkout SDK 1.6.33

**Email Service:**

- **SMTP Server**:
  - Gmail SMTP (smtp.gmail.com) - for development
  - Production SMTP server (configurable)
- **Email Account**:
  - Gmail account with App Password (for Gmail SMTP)
  - Or production email service account
- **Spring Mail**: Included in Spring Boot dependencies

**Internet Connectivity:**

- Stable internet connection required for:
  - Maven/Gradle dependency downloads
  - API testing and integration
  - Payment gateway communication
  - Email service
  - Database connections (if remote)

#### 3.2.5 Runtime Environment

**Backend Runtime:**

- **Java Runtime Environment (JRE)**: Java 21 or higher
- **Spring Boot**: Version 3.5.6 (embedded server)
- **Application Port**: 8080 (configurable)
- **JVM Options**: Configurable for memory and performance tuning

**Android Runtime:**

- **Android Operating System**: Android 7.0 (API 24) or higher
- **Google Play Services**: Not required (app uses direct API calls)
- **Internet Permission**: Required for network operations
- **Storage Permission**: Required for image caching

#### 3.2.6 Additional Software Tools

**Documentation:**

- **Markdown Editor**: For documentation (VS Code, Typora, MarkdownPad)
- **API Documentation**: Postman Collection for API testing

**Design Tools (Optional):**

- **UI/UX Design**: Figma, Adobe XD (for UI mockups)
- **Image Editing**: For app icons and graphics

**Monitoring and Logging (Production):**

- **Application Monitoring**: Spring Boot Actuator (included)
- **Log Management**: Logback (included with Spring Boot)
- **Error Tracking**: Optional third-party services

**Deployment (Production):**

- **Cloud Platform**: AWS, Azure, Google Cloud Platform (optional)
- **Container Platform**: Docker, Kubernetes (optional)
- **CI/CD Tools**: Jenkins, GitHub Actions, GitLab CI (optional)

---

## 4. System Design

### 4.1 System Architecture

The PlateMate system follows a **three-tier architecture** with clear separation of concerns, ensuring scalability, maintainability, and security. The architecture consists of Presentation Layer, Application Layer, and Data Layer.

#### 4.1.1 Overall System Architecture

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    PRESENTATION LAYER (Client Tier)                           ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║                                                                               ║
║  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐   ║
║  │   Android Mobile Application     │  │      Admin Web Panel             │   ║
║  │   (Native Java - API 24+)        │  │      (Web Interface)             │   ║
║  ├──────────────────────────────────┤  ├──────────────────────────────────┤   ║
║  │  • Customer Interface            │  │  • Dashboard & Analytics         │   ║
║  │  • Provider Interface            │  │  • User Management               │   ║
║  │  • Delivery Partner Interface    │  │  • Provider Verification         │   ║
║  │  • Material Design UI            │  │  • Order Management              │   ║
║  │  • Retrofit Client               │  │  • System Configuration          │   ║
║  │  • Session Management            │  │  • Category Management           │   ║
║  └──────────────┬───────────────────┘  └──────────────┬───────────────────┘   ║
║                 │                                       │                     ║
║                 └──────────────┬────────────────────────┘                     ║
║                                │                                              ║
║                    ┌───────────┴───────────┐                                  ║
║                    │   HTTPS/REST API      │                                  ║
║                    │   JSON Format         │                                  ║
║                    │   Port: 8080          │                                  ║
║                    └──────────┬─────────── ┘                                  ║
║                               │                                               ║
╚═══════════════════════════════╪═══════════════════════════════════════════════╝
                                │
                                │ HTTP Requests (JSON) / Responses
                                │
╔═══════════════════════════════╪═══════════════════════════════════════════════╗
║              APPLICATION LAYER (Business Logic & API Tier)                    ║
╠═══════════════════════════════╪═══════════════════════════════════════════════╣
║                               │                                               ║
║     ┌──────────────────────────────────────────────────────────────┐          ║
║     │           Spring Boot REST API Server                        │          ║
║     │           (Embedded Tomcat Server - Port: 8080)              │          ║
║     │           Java 21 | Spring Boot 3.5.6                        │          ║
║     ├──────────────────────────────────────────────────────────────┤          ║
║     │                                                              │          ║
║     │  ╔═══════════════════════════════════════════════════════╗   │          ║
║     │  ║    SECURITY LAYER (JWT Authentication & Authorization)║   │          ║
║     │  ╠═══════════════════════════════════════════════════════╣   │          ║
║     │  ║  • JwtFilter - Request Interceptor & Token Validation ║   │          ║
║     │  ║  • CustomSecurityConfig - Security Configuration      ║   │          ║
║     │  ║  • JwtUtil - Token Generation & Validation            ║   │          ║
║     │  ║  • Role-Based Access Control (RBAC)                   ║   │          ║
║     │  ║  • Password Encryption (BCrypt)                       ║   │          ║
║     │  ╚═══════════════════════════════════════════════════════╝   │          ║
║     │                                                              │          ║
║     │  ╔═══════════════════════════════════════════════════════╗   │          ║
║     │  ║         CONTROLLER LAYER (REST API Endpoints)         ║   │          ║
║     │  ╠═══════════════════════════════════════════════════════╣   │          ║
║     │  ║  Authentication:                                      ║   │          ║
║     │  ║    • AuthController (/api/auth/*)                     ║   │          ║
║     │  ║                                                       ║   │          ║
║     │  ║  User Management:                                     ║   │          ║
║     │  ║    • UserController, CustomerController               ║   │          ║
║     │  ║    • ProviderController, DeliveryPartnerController    ║   │          ║
║     │  ║                                                       ║   │          ║
║     │  ║  Business Operations:                                 ║   │          ║
║     │  ║    • MenuItemController, CartController               ║   │          ║
║     │  ║    • OrderController, PaymentController               ║   │          ║
║     │  ║    • AddressController, RatingReviewController        ║   │          ║
║     │  ║    • AdminDashboardController, ImageController        ║   │          ║
║     │  ║    • CategoryController                               ║   │          ║
║     │  ╚═══════════════════════════════════════════════════════╝   │          ║
║     │                                                              │          ║
║     │  ╔═══════════════════════════════════════════════════════╗   │          ║
║     │  ║         SERVICE LAYER (Business Logic Implementation) ║   │          ║
║     │  ╠═══════════════════════════════════════════════════════╣   │          ║
║     │  ║  Core Services:                                       ║   │          ║
║     │  ║    • UserService, CustomerService                     ║   │          ║
║     │  ║    • TiffinProviderService, DeliveryPartnerService    ║   │          ║
║     │  ║                                                       ║   │          ║
║     │  ║  Business Services:                                   ║   │          ║
║     │  ║    • MenuItemService, CartService                     ║   │          ║
║     │  ║    • OrderService, PaymentService                     ║   │          ║
║     │  ║    • AddressService, RatingReviewService              ║   │          ║
║     │  ║                                                       ║   │          ║
║     │  ║  Utility Services:                                    ║   │          ║
║     │  ║    • EmailService (SMTP), ImageService                ║   │          ║
║     │  ║    • DashboardService                                 ║   │          ║
║     │  ╚═══════════════════════════════════════════════════════╝   │          ║
║     │                                                              │          ║
║     └───────────────────────────────┬──────────────────────────────┘          ║
║                                     │                                         ║
╚═════════════════════════════════════╪═════════════════════════════════════════╝
                                      │
                                      │ JPA/Hibernate ORM
                                      │ JDBC Queries
                                      │
╔═════════════════════════════════════╪════════════════════════════════════════════╗
║                  DATA LAYER (Persistence & Database Tier)                        ║
╠═════════════════════════════════════╪════════════════════════════════════════════╣
║                                     │                                            ║
║     ┌──────────────────────────────────────────────────────────────┐             ║
║     │      REPOSITORY LAYER (Spring Data JPA / Hibernate)          │             ║
║     ├──────────────────────────────────────────────────────────────┤             ║
║     │  User Management Repositories:                               │             ║
║     │    • UserRepository, CustomerRepository                      │             ║
║     │    • TiffinProviderRepository, DeliveryPartnerRepository     │             ║
║     │                                                              │             ║
║     │  Business Repositories:                                      │             ║
║     │    • MenuItemRepository, CartRepository                      │             ║
║     │    • OrderRepository, PaymentRepository                      │             ║
║     │    • AddressRepository, RatingReviewRepository               │             ║
║     │    • CategoryRepository, ImageRepository                     │             ║
║     │    • DeliveryZoneRepository                                  │             ║
║     └──────────────────────┬───────────────────────────────────────┘             ║
║                            │                                                     ║
║                            │ SQL Queries (JDBC)                                  ║
║                            │                                                     ║
║     ┌──────────────────────┴───────────────────────────────────────┐             ║
║     │              PostgreSQL DATABASE SERVER                      │             ║
║     │              (Port: 5432 | Version: 12+)                     │             ║
║     ├──────────────────────────────────────────────────────────────┤             ║
║     │  Core Tables:                                                │             ║
║     │    • users, customers, tiffin_providers                      │             ║
║     │    • delivery_partners, addresses                            │             ║
║     │                                                              │             ║
║     │  Business Tables:                                            │             ║
║     │    • menu_items, categories, cart_items                      │             ║
║     │    • orders, payments, ratings_reviews                       │             ║
║     │    • delivery_zones, images                                  │             ║
║     │                                                              │             ║
║     │  Relationships: Foreign Keys, Constraints, Indexes           │             ║
║     └──────────────────────────────────────────────────────────────┘             ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
                                       │
                                       │
╔══════════════════════════════════════════════════════════════════════════════════╗
║              EXTERNAL SERVICES LAYER (Integration & Third-Party Tier)            ║
╠══════════════════════════════════════════════════════════════════════════════════╣
║                                                                                  ║
║  ┌────────────────────────────────────┐  ┌────────────────────────────────────┐  ║
║  │    Razorpay Payment Gateway        │  │      SMTP Email Service            │  ║
║  │    (Payment Processing API)        │  │      (Gmail SMTP Server)           │  ║
║  ├────────────────────────────────────┤  ├────────────────────────────────────┤  ║
║  │  • Payment Order Creation          │  │  • OTP Generation & Delivery       │  ║
║  │  • Payment Verification            │  │  • Order Notifications             │  ║
║  │  • Webhook Handling                │  │  • Status Update Emails            │  ║
║  │  • Transaction Management          │  │  • System Alerts                   │  ║
║  │  • Refund Processing               │  │  • Email Templates                 │  ║
║  └────────────────────────────────────┘  └────────────────────────────────────┘  ║
║                                                                                  ║
║  ┌────────────────────────────────────┐                                          ║
║  │      File Storage System           │                                          ║
║  │      (Local File System)           │                                          ║
║  ├────────────────────────────────────┤                                          ║
║  │  • Menu Item Images                │                                          ║
║  │  • User Profile Pictures           │                                          ║
║  │  • Category Icons                  │                                          ║
║  │  • Image Metadata (Database)       │                                          ║
║  │  • Image Upload/Download API       │                                          ║
║  └────────────────────────────────────┘                                          ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════===═╝

═══════════════════════════════════════════════════════════════════════════════
                          DATA FLOW DIRECTION
═══════════════════════════════════════════════════════════════════════════════

Request Flow (Client → Server):
  Presentation Layer → Application Layer → Data Layer → External Services
         ↓                    ↓                ↓              ↓
    (User Input)      (Business Logic)  (Data Access)  (Integration)

Response Flow (Server → Client):
  External Services → Data Layer → Application Layer → Presentation Layer
         ↑                ↑              ↑                ↑
    (Results)        (Data)        (Processed)      (Display)

Communication Protocols:
  • HTTP/HTTPS (REST API)
  • JSON (Data Format)
  • JDBC (Database Connection)
  • SMTP (Email Service)
  • Razorpay API (Payment Gateway)
```

#### 4.1.2 Component Interaction Flow

```
┌──────────────┐
│   Android    │
│   App/Admin  │
│    Panel     │
└──────┬───────┘
       │
       │ 1. HTTP Request (REST API)
       │    Headers: Authorization: Bearer <JWT>
       │
       ▼
┌─────────────────────────────────┐
│   Spring Security Filter Chain  │
│   • JWT Authentication          │
│   • Role-based Authorization    │
└──────────────┬──────────────────┘
               │
               │ 2. Authenticated Request
               │
               ▼
┌─────────────────────────────────┐
│      Controller Layer           │
│   • Validates Request           │
│   • Maps to Service Methods     │
└──────────────┬──────────────────┘
               │
               │ 3. Business Logic Call
               │
               ▼
┌─────────────────────────────────┐
│       Service Layer             │
│   • Business Logic              │
│   • Validation                  │
│   • External Service Calls      │
│     (Razorpay, Email)           │
└──────────────┬──────────────────┘
               │
               │ 4. Data Access
               │
               ▼
┌─────────────────────────────────┐
│      Repository Layer           │
│   • JPA/Hibernate ORM           │
│   • Database Queries            │
└──────────────┬──────────────────┘
               │
               │ 5. SQL Queries
               │
               ▼
┌─────────────────────────────────┐
│    PostgreSQL Database          │
│   • Data Storage                │
│   • Transaction Management      │
└─────────────────────────────────┘
```

#### 4.1.3 Database Entity Relationship

```
┌─────────────┐
│    User     │◄──────────────-───┐
│             │                   │
│ • id        │                   │
│ • username  │                   │
│ • email     │                   │
│ • password  │                   │
│ • role      │                   │
└──────┬──────┘                   │
       │                          │
       │ 1:1                      │ 1:1
       │                          │
       ├──────────────┬───────────┼──────────────┐
       │              │           │              │
       ▼              ▼           ▼              ▼
┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Customer │  │TiffinProvider│  │DeliveryPartner│ │    Admin     │
│          │  │              │  │              │  │              │
│ • id     │  │ • id         │  │ • id         │  │ • id         │
│ • name   │  │ • name       │  │ • name       │  │ • name       │
│ • phone  │  │ • address    │  │ • vehicle    │  │              │
│ • userId │  │ • isVerified │  │ • license    │  │              │
└────┬─────┘  │ • userId     │  │ • userId     │  └──────────────┘
     │        └──────┬───────┘  └──────┬───────┘
     │               │                 │
     │ 1:N          │ 1:N              │ 1:N
     │               │                 │
     ▼               ▼                 ▼
┌──────────┐  ┌──────────────┐  ┌─────────────┐
│  Order   │  │  MenuItem    │  │  Order      │
│          │  │              │  │             │
│ • id     │  │ • id         │  │ • id        │
│ • status │  │ • name       │  │ • status    │
│ • total  │  │ • price      │  │ • total     │
│ • custId │  │ • providerId │  │ • dpId      │
└────┬─────┘  │ • categoryId │  └─────────────┘
     │        └──────────────┘
     │
     │ N:M
     │
     ▼
┌──────────┐
│OrderItem │
│          │
│ • orderId│
│ • itemId │
│ • qty    │
│ • price  │
└──────────┘
```

### 4.2 Use Case Diagram

The Use Case Diagram illustrates the interactions between different actors (users) and the system functionalities.

```
                                    ┌─────────────────────────────────────┐
                                    │         PlateMate System            │
                                    └─────────────────────────────────────┘
                                              │
        ┌─────────────────────────────────────┼─────────────────────────────────────┐
        │                                     │                                     │
        │                                     │                                     │
┌───────▼────────┐                   ┌────────▼────────┐                  ┌─────────▼────────┐
│   Customer     │                   │    Provider     │                  │ Delivery Partner │
└───────┬────────┘                   └────────┬────────┘                  └─────────┬────────┘
        │                                     │                                     │
        │                                     │                                     │
        ├─ Register/Login                     ├─ Register/Login                     ├─ Register/Login
        ├─ Browse Menu Items                  ├─ Create Provider Profile            ├─ Create Delivery Profile
        ├─ Search Food Items                  ├─ Manage Menu Items                  ├─ View Assigned Orders
        ├─ View Product Details               ├─ Update Menu Items                  ├─ Update Order Status
        ├─ Add to Cart                        ├─ Delete Menu Items                  ├─ Mark Order Delivered
        ├─ View Cart                          ├─ View Orders                        │
        ├─ Update Cart                        ├─ Accept/Reject Orders               │
        ├─ Remove from Cart                   ├─ Update Order Status                │
        ├─ Manage Addresses                   ├─ View Order History                 │
        ├─ Place Order                        ├─ View Ratings & Reviews             │
        ├─ Make Payment                       │                                     │
        ├─ Track Order                        │                                     │
        ├─ View Order History                 │                                     │
        ├─ Rate & Review                      │                                     │
        └─ Update Profile                     └─ Update Profile                    └─ Update Profile
        │                                     │                                     │
        └─────────────────────────────────────┼─────────────────────────────────────┘
                                              │
                                    ┌─────────▼─────────┐
                                    │       Admin       │
                                    └─────────┬─────────┘
                                              │
                                              ├─ Login
                                              ├─ View Dashboard
                                              ├─ Manage Users
                                              ├─ Verify Providers
                                              ├─ Approve/Reject Providers
                                              ├─ Manage Categories
                                              ├─ View All Orders
                                              ├─ Assign Delivery Partners
                                              ├─ View System Statistics
                                              └─ Manage Delivery Zones
```

#### Use Case Descriptions:

**Customer Use Cases:**

- **Register/Login**: Customer creates account or authenticates
- **Browse Menu Items**: View available food items from providers
- **Search Food Items**: Search for specific food items
- **View Product Details**: See detailed information about menu items
- **Add to Cart**: Add items to shopping cart
- **View/Update/Remove Cart**: Manage cart items
- **Manage Addresses**: Add, edit, delete delivery addresses
- **Place Order**: Create order from cart items
- **Make Payment**: Process payment via Razorpay
- **Track Order**: View real-time order status
- **View Order History**: See past orders
- **Rate & Review**: Provide feedback on providers and items
- **Update Profile**: Modify personal information

**Provider Use Cases:**

- **Register/Login**: Provider creates account or authenticates
- **Create Provider Profile**: Set up business profile
- **Manage Menu Items**: Create, update, delete menu items
- **View Orders**: See incoming orders
- **Accept/Reject Orders**: Process order requests
- **Update Order Status**: Change order preparation status
- **View Order History**: See past orders
- **View Ratings & Reviews**: Check customer feedback
- **Update Profile**: Modify business information

**Delivery Partner Use Cases:**

- **Register/Login**: Delivery partner creates account or authenticates
- **Create Delivery Profile**: Set up delivery partner profile
- **View Assigned Orders**: See orders assigned by admin
- **Update Order Status**: Update delivery status
- **Mark Order Delivered**: Complete delivery
- **Update Profile**: Modify personal information

**Admin Use Cases:**

- **Login**: Admin authentication
- **View Dashboard**: See system overview and statistics
- **Manage Users**: View, edit, delete users
- **Verify Providers**: Review provider applications
- **Approve/Reject Providers**: Accept or reject provider registrations
- **Manage Categories**: Create, update, delete food categories
- **View All Orders**: Monitor all system orders
- **Assign Delivery Partners**: Assign orders to delivery partners
- **View System Statistics**: Analyze platform metrics
- **Manage Delivery Zones**: Define and manage delivery areas

### 4.3 Activity Diagram

#### 4.3.1 Order Placement Flow (Customer)

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│  Browse Menu    │
│     Items       │
└────┬────────────┘
     │
     ▼
┌─────────────────┐        ┌──────────────┐
│ Select Product  │─────▶ │ View Details │
└────┬────────────┘        └──────┬───────┘
     │                          │
     │                          ▼
     │                  ┌──────────────┐
     │                  │ Add to Cart  │
     │                  └──────┬───────┘
     │                         │
     └─────────────────────────┘
     │
     ▼
┌─────────────────┐
│  View Cart      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐      ┌──────────────┐
│ Cart Empty?     │ YES  │  Continue    │
│                 │─────▶│  Shopping    │
└────┬────────────┘      └──────────────┘
     │ NO
     ▼
┌─────────────────┐
│ Select Address  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐       ┌──────────────┐
│ Address Valid?  │ NO    │ Add/Edit     │
│                 │─────▶ │ Address     │
└────┬────────────┘       └──────┬───────┘
     │ YES                      │
     │                          │
     └──────────────────────────┘
     │
     ▼
┌─────────────────┐
│  Place Order    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Initiate       │
│  Payment        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐       ┌──────────────┐
│ Payment         │ FAIL  │  Retry       │
│ Successful?     │────▶ │  Payment    │
└────┬────────────┘       └──────┬───────┘
     │ YES                      │
     │                          │
     └──────────────────────────┘
     │
     ▼
┌─────────────────┐
│  Order          │
│  Confirmed      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Track Order    │
└────┬────────────┘
     │
     ▼
┌─────────┐
│  End    │
└─────────┘
```

#### 4.3.2 Order Processing Flow (Provider)

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Receive Order   │
│  Notification   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  View Order     │
│  Details        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐        ┌──────────────┐
│ Accept Order?   │ NO     │  Reject      │
│                 │─────▶  │   Order       │
└────┬────────────┘        └──────┬───────┘
     │ YES                      │
     │                          ▼
     │                  ┌──────────────┐
     │                  │ Notify       │
     │                  │ Customer     │
     │                  └──────┬───────┘
     │                         │
     │                         ▼
     │                  ┌──────────────┐
     │                  │  End         │
     │                  └──────────────┘
     │
     ▼
┌─────────────────┐
│ Update Status:  │
│ Preparing       │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Prepare Food    │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Update Status:  │
│ Ready           │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Wait for        │
│ Delivery        │
│ Assignment      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Update Status:  │
│ Out for         │
│ Delivery        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│  Order          │
│  Completed      │
└────┬────────────┘
     │
     ▼
┌─────────┐
│  End    │
└─────────┘
```

#### 4.3.3 Authentication Flow

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────────────┐      ┌──────────────┐
│ User Exists?    │ NO   │  Register    │
│                 │────▶│  New User    │
└────┬────────────┘      └──────┬───────┘
     │ YES                      │
     │                          ▼
     │                  ┌──────────────┐
     │                  │ Create       │
     │                  │ Account      │
     │                  └──────┬───────┘
     │                         │
     │                         ▼
     │                  ┌──────────────┐
     │                  │  Login       │
     │                  └──────┬───────┘
     │                         │
     └─────────────────────────┘
     │
     ▼
┌─────────────────┐
│ Enter           │
│ Credentials     │
└────┬────────────┘
     │
     ▼
┌─────────────────┐      ┌──────────────┐
│ Validate        │ FAIL │ Show Error   │
│ Credentials     │─────▶│ Message      │
└────┬────────────┘      └──────┬───────┘
     │ VALID                     │
     │                           │
     │                           └─────────┐
     │                                     │
     ▼                                     │
┌─────────────────┐                        │
│ Generate JWT    │                        │
│ Token           │                        │
└────┬────────────┘                        │
     │                                     │
     ▼                                     │
┌─────────────────┐                        │
│ Return Token   │                         │
│ & User Info    │                         │
└────┬────────────┘                        │
     │                                     │
     ▼                                     │
┌─────────────────┐                        │
│ Store Token     │                        │
│ (Client)        │                        │
└────┬────────────┘                        │
     │                                     │
     ▼                                     │
┌─────────────────┐                        │
│ Redirect to     │                        │
│ Dashboard       │                        │
└─────────────────┘                        │
     │                                     │
     └──────────────────────────────────── ┘
```

### 4.4 XML UI Wireframes

The Android application uses XML layout files to define the user interface. Below are descriptions of key screens and their layouts.

#### 4.4.1 Authentication Screens

**1. Splash Screen (`activity_splash.xml`)**

```
┌─────────────────────────────────┐
│                                 │
│         [PlateMate Logo]        │
│                                 │
│      "Home Made Food Delivery"  │
│                                 │
│         [Loading...]            │
│                                 │
└─────────────────────────────────┘
```

**2. Login Screen (`activity_login.xml`)**

```
┌─────────────────────────────────┐
│  ← Back                   [Logo]│
│                                 │
│     Welcome Back!               │
│     Sign in to continue         │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Username/Email            │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password          [👁]    │  │
│  └───────────────────────────┘  │
│                                 │
│  [ ] Remember Me                │
│                                 │
│  [Forgot Password?]             │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Sign In              │  │
│  └───────────────────────────┘  │
│                                 │
│  Don't have an account?         │
│  [Sign Up]                      │
│                                 │
└─────────────────────────────────┘
```

**3. Sign Up Screen (`activity_sign_up.xml`)**

```
┌─────────────────────────────────┐
│  ← Back                   [Logo]│
│                                 │
│     Create Account              │
│     Join PlateMate today        │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Full Name                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Email                     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Phone Number              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Password          [👁]    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Confirm Password  [👁]    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Select Role: [Dropdown ▼] │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │      Create Account       │  │
│  └───────────────────────────┘  │
│                                 │
│  Already have an account?       │
│  [Sign In]                      │
│                                 │
└─────────────────────────────────┘
```

#### 4.4.2 Customer Screens

**4. Customer Home Screen (`activity_customer_home.xml`)**

```
┌─────────────────────────────────┐
│ [☰] PlateMate                  │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  Search for food...         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Categories                  │ │
│ │ [🍕] [🍔] [🍜] [🍰] [🍛] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Best Foods                  │ │
│ │ ┌─────┐ ┌─────┐ ┌─────┐     │ │
│ │ │[IMG]│ │[IMG]│ │[IMG]│     │ │
│ │ │Name │ │Name │ │Name │     │ │
│ │ │₹100 │ │₹150 │ │₹120 │     │ │
│ │ └─────┘ └─────┘ └─────┘     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ All Products                │ │
│ │ [Product Grid View]         │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**5. Product Detail Screen (`activity_product_detail.xml`)**

```
┌─────────────────────────────────┐
│  ← Back                    [🛒] │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │      [Product Image]      │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Product Name                   │
│  ₹150                           │
│                                 │
│  ⭐ 4.5 (120 reviews)           │
│                                 │
│  Provider: [Provider Name]      │
│                                 │
│  Description:                   │
│  [Product description text...]  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Quantity: [-] 1 [+]       │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Add to Cart            │  │
│  └───────────────────────────┘  │
│                                 │
│  Reviews & Ratings              │
│  [Review List]                  │
│                                 │
└─────────────────────────────────┘
```

**6. Cart Screen (`activity_cart.xml`)**

```
┌─────────────────────────────────┐
│  ← Back              My Cart    │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [IMG] Item Name           │  │
│  │      ₹150                 │  │
│  │      Qty: [-] 2 [+]       │  │
│  │      [Remove]             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ [IMG] Item Name           │  │
│  │      ₹200                 │  │
│  │      Qty: [-] 1 [+]       │  │
│  │      [Remove]             │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Subtotal:        ₹350     │  │
│  │ Delivery:        ₹30      │  │
│  │ ─────────────────────     │  │
│  │ Total:           ₹380     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Proceed to Checkout     │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

**7. Checkout Screen (`activity_checkout.xml`)**

```
┌─────────────────────────────────┐
│  ← Back          Checkout       │
│                                 │
│  Delivery Address               │
│  ┌──────────────────────────┐   │
│  │ 🏠 Home                      │
│  │   123 Main St,City        │   │
│  │   [Edit] [Delete]         │   │
│  └───────────────────────────┘  │
│  [+ Add New Address]            │
│                                 │
│  Order Summary                  │
│  ┌───────────────────────────┐  │
│  │ Item 1 x 2    ₹300        │  │
│  │ Item 2 x 1    ₹200        │  │
│  │ Delivery Fee   ₹30        │  │
│  │ ─────────────────────     │  │
│  │ Total:         ₹530       │  │
│  └───────────────────────────┘  │
│                                 │
│  Payment Method                 │
│  ┌───────────────────────────┐  │
│  │ [✓] Razorpay              │  │
│  │     Pay via Razorpay      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │   Place Order             │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

#### 4.4.3 Provider Screens

**8. Provider Dashboard (`activity_provider_dashboard.xml`)**

```
┌─────────────────────────────────┐
│ [☰] Dashboard          [👤]    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Today's Stats               │ │
│ │ Orders: 15  Revenue: ₹5000  │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ New Orders (3)              │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │ Order #1234             │ │ │
│ │ │ ₹350 • 2 items          │ │ │
│ │ │ [Accept] [Reject]       │ │ │
│ │ └─────────────────────────┘ │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Active Orders               │ │
│ │ [Order List]                │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+ Add Menu Item]               │
│                                 │
└─────────────────────────────────┘
```

**9. Add Product Screen (`activity_add_product.xml`)**

```
┌─────────────────────────────────┐
│  ← Back      Add Menu Item      │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Product Image]        │  │
│  │    [+ Add Image]          │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Item Name                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Description               │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Price (₹)                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Category: [Dropdown ▼]    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Meal Type: [Dropdown ▼]   │  │
│  └───────────────────────────┘  │
│                                 │
│  [ ] Available                  │
│                                 │
│  ┌───────────────────────────┐  │
│  │    Save Menu Item         │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

#### 4.4.4 Delivery Partner Screens

**10. Delivery Partner Dashboard (`activity_delivery_partner_dashboard.xml`)**

```
┌─────────────────────────────────┐
│ [☰] Dashboard          [👤]    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Today's Stats               │ │
│ │ Deliveries: 8 Earnings: ₹400│ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Assigned Orders (2)         │ │
│ │ ┌─────────────────────────┐ │ │
│ │ │ Order #1234             │ │ │
│ │ │ From: Provider Name     │ │ │
│ │ │ To: Customer Address    │ │ │
│ │ │ [View Details] [Accept] │ │ │
│ │ └─────────────────────────┘ │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Active Deliveries           │ │
│ │ [Order List]                │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

#### 4.4.5 Common Components

**11. Order Detail Screen (`activity_order_detail.xml`)**

```
┌─────────────────────────────────┐
│  ← Back      Order #1234        │
│                                 │
│  Status: [Preparing]            │
│                                 │
│  Order Items                    │
│  ┌───────────────────────────┐  │
│  │ [IMG] Item 1 x 2  ₹300    │  │
│  │ [IMG] Item 2 x 1  ₹200    │  │
│  └───────────────────────────┘  │
│                                 │
│  Delivery Address               │
│  ┌───────────────────────────┐  │
│  │ 🏠 123 Main St           |   |
│  │    City, State - 123456   │  │
│  └───────────────────────────┘  │
│                                 │
│  Payment Details                │
│  ┌───────────────────────────┐  │
│  │ Subtotal:      ₹500       │  │
│  │ Delivery:      ₹30        │  │
│  │ Total:         ₹530       │  │
│  │ Status: Paid              │  │
│  └───────────────────────────┘  │
│                                 │
│  [Track Order]                  │
│                                 │
└─────────────────────────────────┘
```

**12. Profile Screen (`activity_customer_profile.xml`)**

```
┌─────────────────────────────────┐
│  ← Back          Profile        │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │      [Profile Image]      │  │
│  │      [Edit]               │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  Name: John Doe                 │
│  Email: john@example.com        │
│  Phone: +91 1234567890          │
│                                 │
│  ┌───────────────────────────┐  │
│  │ My Orders                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Addresses                 │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Edit Profile              │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Logout                    │  │
│  └───────────────────────────┘  │
│                                 │
└─────────────────────────────────┘
```

---

## 5. Development

### 5.1 Project Structure

The PlateMate project is organized into two main components: Backend (Spring Boot) and Android Mobile Application. Each follows industry-standard project structure and best practices.

#### 5.1.1 Backend Project Structure

```
platemate-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── platemate/
│   │   │           ├── PlateMateApplication.java          # Main Spring Boot application
│   │   │           │
│   │   │           ├── config/                           # Configuration classes
│   │   │           │   ├── RazorpayConfig.java           # Razorpay payment configuration
│   │   │           │   ├── RazorpayProperties.java        # Razorpay properties
│   │   │           │   └── security/                     # Security configuration
│   │   │           │       ├── CustomSecurityConfig.java # Spring Security config
│   │   │           │       ├── JwtFilter.java            # JWT authentication filter
│   │   │           │       ├── JwtUtil.java               # JWT utility methods
│   │   │           │       └── CustomAuthenticationEntryPoint.java
│   │   │           │
│   │   │           ├── controller/                        # REST Controllers (API endpoints)
│   │   │           │   ├── AuthController.java           # Authentication endpoints
│   │   │           │   ├── UserController.java          # User management
│   │   │           │   ├── CustomerController.java        # Customer operations
│   │   │           │   ├── ProviderController.java        # Provider operations
│   │   │           │   ├── MenuItemController.java        # Menu item management
│   │   │           │   ├── CartController.java           # Cart operations
│   │   │           │   ├── OrderController.java          # Order management
│   │   │           │   ├── PaymentController.java        # Payment processing
│   │   │           │   ├── DeliveryPartnerController.java # Delivery partner ops
│   │   │           │   ├── AddressController.java       # Address management
│   │   │           │   ├── CategoryController.java       # Category management
│   │   │           │   ├── RatingReviewController.java   # Ratings & reviews
│   │   │           │   ├── AdminDashboardController.java # Admin dashboard
│   │   │           │   └── ImageController.java          # Image upload/download
│   │   │           │
│   │   │           ├── service/                           # Business logic layer
│   │   │           │   ├── UserService.java              # User service
│   │   │           │   ├── CustomerService.java          # Customer service
│   │   │           │   ├── TiffinProviderService.java    # Provider service
│   │   │           │   ├── MenuItemService.java          # Menu item service
│   │   │           │   ├── CartService.java               # Cart service
│   │   │           │   ├── OrderService.java              # Order service
│   │   │           │   ├── PaymentService.java           # Payment service
│   │   │           │   ├── DeliveryPartnerService.java   # Delivery partner service
│   │   │           │   ├── AddressService.java            # Address service
│   │   │           │   ├── EmailService.java              # Email service
│   │   │           │   └── ImageService.java              # Image service
│   │   │           │
│   │   │           ├── repository/                       # Data access layer (JPA)
│   │   │           │   ├── UserRepository.java            # User repository
│   │   │           │   ├── CustomerRepository.java       # Customer repository
│   │   │           │   ├── TiffinProviderRepository.java  # Provider repository
│   │   │           │   ├── MenuItemRepository.java       # Menu item repository
│   │   │           │   ├── OrderRepository.java           # Order repository
│   │   │           │   ├── CartRepository.java            # Cart repository
│   │   │           │   ├── PaymentRepository.java        # Payment repository
│   │   │           │   └── DeliveryPartnerRepository.java # Delivery partner repo
│   │   │           │
│   │   │           ├── model/                           # Entity classes (Database models)
│   │   │           │   ├── BaseEntity.java               # Base entity with common fields
│   │   │           │   ├── User.java                     # User entity
│   │   │           │   ├── Customer.java                  # Customer entity
│   │   │           │   ├── TiffinProvider.java            # Provider entity
│   │   │           │   ├── DeliveryPartner.java          # Delivery partner entity
│   │   │           │   ├── MenuItem.java                  # Menu item entity
│   │   │           │   ├── Order.java                     # Order entity
│   │   │           │   ├── Cart.java                     # Cart entity
│   │   │           │   ├── Payment.java                  # Payment entity
│   │   │           │   ├── Address.java                  # Address entity
│   │   │           │   ├── Category.java                 # Category entity
│   │   │           │   ├── RatingReview.java             # Rating/review entity
│   │   │           │   └── Image.java                    # Image entity
│   │   │           │
│   │   │           ├── dto/                              # Data Transfer Objects
│   │   │           │   ├── CustomerDtos.java              # Customer DTOs
│   │   │           │   ├── MenuItemDtos.java              # Menu item DTOs
│   │   │           │   ├── OrderDtos.java                 # Order DTOs
│   │   │           │   ├── PaymentDtos.java                # Payment DTOs
│   │   │           │   └── CartDtos.java                  # Cart DTOs
│   │   │           │
│   │   │           ├── enums/                            # Enumeration classes
│   │   │           │   ├── Role.java                     # User roles
│   │   │           │   ├── OrderStatus.java              # Order statuses
│   │   │           │   ├── PaymentStatus.java            # Payment statuses
│   │   │           │   ├── MealType.java                 # Meal types
│   │   │           │   └── AddressType.java              # Address types
│   │   │           │
│   │   │           ├── exception/                        # Exception handling
│   │   │           │   ├── GlobalExceptionHandler.java   # Global exception handler
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── BadRequestException.java
│   │   │           │   └── UnauthorizedException.java
│   │   │           │
│   │   │           └── utils/                           # Utility classes
│   │   │               ├── ImageUtils.java               # Image processing utilities
│   │   │               └── ImageResponse.java            # Image response wrapper
│   │   │
│   │   └── resources/
│   │       ├── application.properties                    # Application configuration
│   │       └── static/                                  # Static resources (if any)
│   │
│   └── test/                                             # Test classes
│       └── java/
│           └── com/
│               └── platemate/
│
├── target/                                                # Build output directory
├── pom.xml                                                # Maven configuration
├── mvnw                                                    # Maven wrapper (Unix)
├── mvnw.cmd                                               # Maven wrapper (Windows)
├── .gitignore                                             # Git ignore rules
└── README.md                                              # Project documentation
```

#### 5.1.2 Android Project Structure

```
android-main/
└── platemate-backend/
    ├── app/
    │   ├── src/
    │   │   ├── main/
    │   │   │   ├── java/
    │   │   │   │   └── com/
    │   │   │   │       └── example/
    │   │   │   │           └── platemate/
    │   │   │   │               │
    │   │   │   │               ├── Activities/                    # Activity classes
    │   │   │   │               │   ├── SplashActivity.java        # Splash screen
    │   │   │   │               │   ├── LoginActivity.java        # Login screen
    │   │   │   │               │   ├── SignUpActivity.java      # Registration
    │   │   │   │               │   ├── MainActivity.java        # Main activity
    │   │   │   │               │   ├── CustomerHomeActivity.java # Customer home
    │   │   │   │               │   ├── ProductDetailActivity.java # Product details
    │   │   │   │               │   ├── CartActivity.java         # Shopping cart
    │   │   │   │               │   ├── CheckoutActivity.java      # Checkout
    │   │   │   │               │   ├── OrderDetailActivity.java   # Order details
    │   │   │   │               │   ├── ProviderDashboardActivity.java # Provider dashboard
    │   │   │   │               │   ├── AddProductActivity.java     # Add menu item
    │   │   │   │               │   ├── DeliveryPartnerDashboardActivity.java # DP dashboard
    │   │   │   │               │   └── AllProductsActivity.java   # All products
    │   │   │   │               │
    │   │   │   │               ├── Fragments/                      # Fragment classes
    │   │   │   │               │   ├── CustomerOrdersFragment.java
    │   │   │   │               │   ├── CustomerProfileFragment.java
    │   │   │   │               │   ├── ProviderProfileFragment.java
    │   │   │   │               │   ├── DeliveryPartnerOrdersFragment.java
    │   │   │   │               │   └── ProductsFragment.java
    │   │   │   │               │
    │   │   │   │               ├── Adapters/                     # RecyclerView adapters
    │   │   │   │               │   ├── ProductAdapter.java       # Product list adapter
    │   │   │   │               │   ├── CartAdapter.java           # Cart adapter
    │   │   │   │               │   ├── OrderAdapter.java         # Order adapter
    │   │   │   │               │   ├── CategoryAdapter.java       # Category adapter
    │   │   │   │               │   ├── BestFoodAdapter.java       # Best food adapter
    │   │   │   │               │   └── ReviewAdapter.java          # Review adapter
    │   │   │   │               │
    │   │   │   │               ├── Models/                        # Data models
    │   │   │   │               │   ├── User.java                  # User model
    │   │   │   │               │   ├── Customer.java             # Customer model
    │   │   │   │               │   ├── Product.java               # Product model
    │   │   │   │               │   ├── MenuItem.java              # Menu item model
    │   │   │   │               │   ├── Order.java                 # Order model
    │   │   │   │               │   ├── CartItem.java               # Cart item model
    │   │   │   │               │   ├── Address.java                # Address model
    │   │   │   │               │   └── Category.java               # Category model
    │   │   │   │               │
    │   │   │   │               ├── Network/                       # Network layer
    │   │   │   │               │   ├── RetrofitClient.java         # Retrofit client
    │   │   │   │               │   └── ApiInterface.java          # API interface
    │   │   │   │               │
    │   │   │   │               ├── Utils/                         # Utility classes
    │   │   │   │               │   ├── SessionManager.java        # Session management
    │   │   │   │               │   └── ToastUtils.java             # Toast utilities
    │   │   │   │               │
    │   │   │   │               └── Dialogs/                      # Dialog classes
    │   │   │   │                   ├── AddressDialog.java        # Address dialog
    │   │   │   │                   ├── RatingDialog.java         # Rating dialog
    │   │   │   │                   └── EditProfileDialog.java    # Edit profile dialog
    │   │   │   │
    │   │   │   ├── res/
    │   │   │   │   ├── layout/                                   # XML layout files
    │   │   │   │   │   ├── activity_login.xml
    │   │   │   │   │   ├── activity_sign_up.xml
    │   │   │   │   │   ├── activity_customer_home.xml
    │   │   │   │   │   ├── activity_product_detail.xml
    │   │   │   │   │   ├── activity_cart.xml
    │   │   │   │   │   ├── activity_checkout.xml
    │   │   │   │   │   ├── activity_provider_dashboard.xml
    │   │   │   │   │   └── [47 total layout files]
    │   │   │   │   │
    │   │   │   │   ├── drawable/                                 # Drawable resources
    │   │   │   │   ├── values/                                   # Values (strings, colors)
    │   │   │   │   │   ├── strings.xml
    │   │   │   │   │   ├── colors.xml
    │   │   │   │   │   └── themes.xml
    │   │   │   │   │
    │   │   │   │   └── mipmap/                                  # App icons
    │   │   │   │
    │   │   │   └── AndroidManifest.xml                          # App manifest
    │   │   │
    │   │   └── test/                                             # Test classes
    │   │
    │   ├── build.gradle.kts                                     # App-level Gradle config
    │   └── proguard-rules.pro                                   # ProGuard rules
    │
    ├── build.gradle.kts                                         # Project-level Gradle config
    ├── settings.gradle.kts                                      # Gradle settings
    ├── gradle.properties                                         # Gradle properties
    ├── gradlew                                                   # Gradle wrapper (Unix)
    ├── gradlew.bat                                               # Gradle wrapper (Windows)
    └── local.properties                                         # Local configuration
```

### 5.2 XML Layout Screens

The Android application uses XML layout files to define the user interface. Key layout files are organized by functionality.

#### 5.2.1 Authentication Layouts

**`activity_splash.xml`** - Splash Screen

- Displays PlateMate logo
- Shows loading animation
- Redirects to appropriate screen based on login status

**`activity_login.xml`** - Login Screen

- Username/Email input field
- Password input field with show/hide toggle
- Remember me checkbox
- Sign in button
- Link to sign up screen

**`activity_sign_up.xml`** - Registration Screen

- Full name input
- Email input
- Phone number input
- Password and confirm password fields
- Role selection dropdown (Customer/Provider/Delivery Partner)
- Create account button

#### 5.2.2 Customer Layouts

**`activity_customer_home.xml`** - Customer Home Screen

- Top navigation bar with menu, search, cart, and profile icons
- Search bar for food items
- Horizontal scrollable category list
- Best foods section with horizontal RecyclerView
- All products grid/list view
- Bottom navigation (if implemented)

**`activity_product_detail.xml`** - Product Detail Screen

- Large product image at top
- Product name and price
- Rating and review count
- Provider information
- Product description
- Quantity selector
- Add to cart button
- Reviews section

**`activity_cart.xml`** - Shopping Cart Screen

- List of cart items with:
  - Product image
  - Product name
  - Price per item
  - Quantity controls (increment/decrement)
  - Remove button
- Order summary section:
  - Subtotal
  - Delivery fee
  - Total amount
- Proceed to checkout button

**`activity_checkout.xml`** - Checkout Screen

- Delivery address selection/management
- Order summary with itemized list
- Payment method selection
- Place order button

**`activity_order_detail.xml`** - Order Detail Screen

- Order status indicator
- Order items list
- Delivery address
- Payment details
- Order tracking information

#### 5.2.3 Provider Layouts

**`activity_provider_dashboard.xml`** - Provider Dashboard

- Today's statistics (orders, revenue)
- New orders section
- Active orders list
- Quick action buttons (Add menu item, etc.)

**`activity_add_product.xml`** - Add Menu Item Screen

- Image upload section
- Item name input
- Description text area
- Price input
- Category dropdown
- Meal type selection
- Availability toggle
- Save button

**`activity_provider_orders.xml`** - Provider Orders Screen

- List of all orders
- Order status filters
- Order details with accept/reject options

#### 5.2.4 Delivery Partner Layouts

**`activity_delivery_partner_dashboard.xml`** - Delivery Partner Dashboard

- Today's statistics (deliveries, earnings)
- Assigned orders list
- Active deliveries
- Order status update options

**`activity_delivery_partner_order_detail.xml`** - Delivery Order Detail

- Order information
- Pickup address (provider)
- Delivery address (customer)
- Navigation options
- Status update buttons

#### 5.2.5 Common Layout Components

**`item_product.xml`** - Product List Item

- Product image
- Product name
- Price
- Rating
- Quick add to cart button

**`item_cart.xml`** - Cart Item

- Product image
- Product name
- Price
- Quantity controls
- Remove button

**`item_order.xml`** - Order List Item

- Order number
- Order date
- Total amount
- Order status
- View details button

**`dialog_address_form.xml`** - Address Dialog

- Address type selection (Home/Work/Other)
- Full address input
- City, state, pincode fields
- Save/Cancel buttons

**`dialog_rating.xml`** - Rating Dialog

- Star rating selector
- Review text area
- Submit button

### 5.3 Java Code Components

#### 5.3.1 Backend Java Components

**Controllers (REST API Endpoints)**

```java
// Example: AuthController.java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // Handles user registration and login
    // Generates JWT tokens
    // Manages authentication flow
}
```

**Key Controllers:**

- **AuthController**: `/api/auth/*` - Authentication endpoints
- **UserController**: `/api/users/*` - User management
- **CustomerController**: `/api/customer/*` - Customer operations
- **ProviderController**: `/api/provider/*` - Provider operations
- **MenuItemController**: `/api/menu-items/*` - Menu item CRUD
- **CartController**: `/api/cart/*` - Cart operations
- **OrderController**: `/api/orders/*` - Order management
- **PaymentController**: `/api/payments/*` - Payment processing
- **DeliveryPartnerController**: `/api/delivery-partner/*` - Delivery partner ops

**Services (Business Logic)**

```java
// Example: OrderService.java
@Service
public class OrderService {
    // Contains business logic for order processing
    // Validates order creation
    // Updates order status
    // Handles order calculations
}
```

**Key Services:**

- **UserService**: User management and authentication
- **CustomerService**: Customer profile and operations
- **TiffinProviderService**: Provider management and verification
- **MenuItemService**: Menu item business logic
- **CartService**: Cart management and calculations
- **OrderService**: Order processing and status management
- **PaymentService**: Payment processing via Razorpay
- **DeliveryPartnerService**: Delivery partner management
- **EmailService**: Email notifications and OTP

**Repositories (Data Access)**

```java
// Example: OrderRepository.java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Custom query methods
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByProviderId(Long providerId);
}
```

**Models (Entity Classes)**

```java
// Example: Order.java
@Entity
@Table(name = "orders")
public class Order extends BaseEntity {
    @ManyToOne
    private Customer customer;

    @ManyToOne
    private TiffinProvider provider;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private Double totalAmount;
    // ... other fields
}
```

**Key Models:**

- **User**: Base user entity with authentication
- **Customer**: Customer profile information
- **TiffinProvider**: Provider business information
- **DeliveryPartner**: Delivery partner details
- **MenuItem**: Menu item/product information
- **Order**: Order entity with relationships
- **Cart**: Shopping cart items
- **Payment**: Payment transaction records
- **Address**: User addresses
- **Category**: Food categories
- **RatingReview**: Customer ratings and reviews

#### 5.3.2 Android Java Components

**Activities (Screen Controllers)**

```java
// Example: LoginActivity.java
public class LoginActivity extends AppCompatActivity {
    private EditText usernameEditText;
    private EditText passwordEditText;
    private ApiInterface apiInterface;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Initialize UI components
        // Set up click listeners
        // Handle login logic
    }
}
```

**Key Activities:**

- **SplashActivity**: Initial screen, checks login status
- **LoginActivity**: User authentication
- **SignUpActivity**: New user registration
- **CustomerHomeActivity**: Customer main screen
- **ProductDetailActivity**: Product details and add to cart
- **CartActivity**: Shopping cart management
- **CheckoutActivity**: Order placement and payment
- **OrderDetailActivity**: Order information and tracking
- **ProviderDashboardActivity**: Provider main screen
- **AddProductActivity**: Add/edit menu items
- **DeliveryPartnerDashboardActivity**: Delivery partner main screen

**Fragments (Reusable UI Components)**

```java
// Example: CustomerOrdersFragment.java
public class CustomerOrdersFragment extends Fragment {
    private RecyclerView ordersRecyclerView;
    private OrderAdapter orderAdapter;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        // Initialize fragment UI
        // Load orders from API
        // Display in RecyclerView
    }
}
```

**Key Fragments:**

- **CustomerOrdersFragment**: Customer order history
- **CustomerProfileFragment**: Customer profile management
- **ProviderProfileFragment**: Provider profile management
- **DeliveryPartnerOrdersFragment**: Delivery partner orders
- **ProductsFragment**: Product listing

**Adapters (RecyclerView Data Binding)**

```java
// Example: ProductAdapter.java
public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ViewHolder> {
    private List<Product> products;

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Product product = products.get(position);
        holder.productName.setText(product.getName());
        holder.productPrice.setText("₹" + product.getPrice());
        // Load image using Glide
        Glide.with(context).load(product.getImageUrl()).into(holder.productImage);
    }
}
```

**Key Adapters:**

- **ProductAdapter**: Displays product list
- **CartAdapter**: Displays cart items
- **OrderAdapter**: Displays order list
- **CategoryAdapter**: Displays categories
- **BestFoodAdapter**: Displays featured products
- **ReviewAdapter**: Displays reviews

**Network Layer**

```java
// RetrofitClient.java - Singleton Retrofit client
public class RetrofitClient {
    private static RetrofitClient instance;
    private Retrofit retrofit;

    // Configures Retrofit with base URL
    // Adds JWT token interceptor
    // Handles token refresh
}

// ApiInterface.java - API endpoint definitions
public interface ApiInterface {
    @POST("/api/auth/login")
    Call<LoginUserDetails> login(@Body LoginInputDetails loginDetails);

    @GET("/api/menu-items")
    Call<List<MenuItem>> getMenuItems();

    @POST("/api/orders")
    Call<Order> createOrder(@Body CreateOrderRequest request);
}
```

**Utility Classes**

```java
// SessionManager.java - Manages user session
public class SessionManager {
    // Stores JWT token
    // Manages login state
    // Handles token refresh
}

// ToastUtils.java - Toast message utilities
public class ToastUtils {
    public static void showToast(Context context, String message) {
        // Displays toast messages
    }
}
```

### 5.4 Database / Storage

#### 5.4.1 PostgreSQL Database Schema

PlateMate uses PostgreSQL as the primary database. The schema consists of multiple related tables with proper foreign key relationships.

**Core Tables:**

**`users`** - Base user table

```sql
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`customers`** - Customer profiles

```sql
CREATE TABLE customers (
    customer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`tiffin_providers`** - Provider profiles

```sql
CREATE TABLE tiffin_providers (
    provider_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    business_name VARCHAR(255),
    address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`delivery_partners`** - Delivery partner profiles

```sql
CREATE TABLE delivery_partners (
    delivery_partner_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    vehicle_type VARCHAR(50),
    license_number VARCHAR(100),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`menu_items`** - Menu items/products

```sql
CREATE TABLE menu_items (
    menu_item_id BIGSERIAL PRIMARY KEY,
    provider_id BIGINT REFERENCES tiffin_providers(provider_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id BIGINT REFERENCES categories(category_id),
    meal_type VARCHAR(50),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`orders`** - Orders

```sql
CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(customer_id),
    provider_id BIGINT REFERENCES tiffin_providers(provider_id),
    delivery_partner_id BIGINT REFERENCES delivery_partners(delivery_partner_id),
    order_status VARCHAR(50) NOT NULL,
    cart_item_ids TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2),
    delivery_address TEXT NOT NULL,
    order_time TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`cart_items`** - Shopping cart

```sql
CREATE TABLE cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(customer_id),
    menu_item_id BIGINT REFERENCES menu_items(menu_item_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`payments`** - Payment transactions

```sql
CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id),
    amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(50),
    payment_method VARCHAR(50),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`addresses`** - User addresses

```sql
CREATE TABLE addresses (
    address_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(user_id),
    address_type VARCHAR(50),
    full_address TEXT NOT NULL,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`categories`** - Food categories

```sql
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`ratings_reviews`** - Ratings and reviews

```sql
CREATE TABLE ratings_reviews (
    rating_id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT REFERENCES customers(customer_id),
    provider_id BIGINT REFERENCES tiffin_providers(provider_id),
    menu_item_id BIGINT REFERENCES menu_items(menu_item_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

**`images`** - Image storage metadata

```sql
CREATE TABLE images (
    image_id BIGSERIAL PRIMARY KEY,
    image_type VARCHAR(50),
    file_name VARCHAR(255),
    file_path TEXT,
    entity_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 5.4.2 Database Relationships

```
users (1) ──→ (1) customers
users (1) ──→ (1) tiffin_providers
users (1) ──→ (1) delivery_partners
users (1) ──→ (N) addresses

tiffin_providers (1) ──→ (N) menu_items
categories (1) ──→ (N) menu_items

customers (1) ──→ (N) cart_items
menu_items (1) ──→ (N) cart_items

customers (1) ──→ (N) orders
tiffin_providers (1) ──→ (N) orders
delivery_partners (1) ──→ (N) orders

orders (1) ──→ (1) payments

customers (1) ──→ (N) ratings_reviews
tiffin_providers (1) ──→ (N) ratings_reviews
menu_items (1) ──→ (N) ratings_reviews
```

#### 5.4.3 Android Local Storage

The Android application uses **SharedPreferences** for local data storage:

**SessionManager** - Stores:

- JWT authentication token
- Refresh token
- User ID
- User role
- Login status
- User profile information (cached)

**Image Caching:**

- Glide library handles image caching automatically
- Images are cached in device storage for offline viewing

**No SQLite Database:**

- The app does not use SQLite for local storage
- All data is fetched from the backend API in real-time
- Cart items are stored on the server (not locally)

---

## 6. Modules Description

The PlateMate system is organized into multiple functional modules, each handling specific business operations. This section provides an overview of each module, its purpose, key features, and functionality.

### 6.1 Module 1 – Authentication & Authorization Module

#### Overview

The Authentication & Authorization Module is the foundation of the PlateMate system, responsible for user registration, login, and secure access control. It implements JWT (JSON Web Token) based authentication and role-based authorization to ensure secure access to system resources.

#### Key Features

- **User Registration**: Allows new users to create accounts with different roles (Customer, Provider, Delivery Partner, Admin)
- **User Login**: Secure authentication using username/email and password
- **JWT Token Generation**: Creates access tokens and refresh tokens for authenticated sessions
- **Token Refresh**: Automatic token refresh mechanism to maintain user sessions
- **Role-Based Access Control (RBAC)**: Enforces permissions based on user roles
- **Password Encryption**: Uses BCrypt for secure password hashing
- **Session Management**: Manages user sessions across the application

#### Components

- **AuthController**: Handles `/api/auth/*` endpoints
- **UserService**: Manages user operations and authentication logic
- **JwtUtil**: Generates and validates JWT tokens
- **JwtFilter**: Intercepts requests to validate JWT tokens
- **CustomSecurityConfig**: Configures Spring Security settings
- **PasswordEncoder**: Encrypts and validates passwords

#### User Roles

1. **ROLE_CUSTOMER**: End users who order food
2. **ROLE_PROVIDER**: Food providers/tiffin services
3. **DELIVERY_PARTNER**: Delivery personnel
4. **ROLE_ADMIN**: Platform administrators

#### API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

#### Flow

```
User Registration → Account Creation → Login → JWT Token Generation →
Token Validation → Role-Based Access → Protected Resource Access
```

---

### 6.2 Module 2 – Customer Module

#### Overview

The Customer Module manages all customer-related operations, including profile management, menu browsing, cart operations, order placement, and order tracking. It provides the core functionality for end users to discover and order food from providers.

#### Key Features

- **Customer Profile Management**: Create, view, and update customer profiles
- **Menu Browsing**: Browse available menu items from verified providers
- **Product Search**: Search for food items by name, category, or provider
- **Product Details**: View detailed information about menu items including images, descriptions, prices, and reviews
- **Cart Management**: Add, update, remove items from shopping cart
- **Order Placement**: Create orders from cart items
- **Order Tracking**: Real-time order status tracking
- **Order History**: View past orders with details
- **Address Management**: Manage multiple delivery addresses
- **Rating & Reviews**: Rate and review providers and menu items

#### Components

- **CustomerController**: Handles `/api/customer/*` endpoints
- **CustomerService**: Business logic for customer operations
- **CustomerRepository**: Data access for customer entities
- **CustomerHomeActivity**: Android customer home screen
- **ProductDetailActivity**: Product details screen
- **CartActivity**: Shopping cart screen
- **OrderDetailActivity**: Order details and tracking

#### API Endpoints

- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update customer profile
- `GET /api/customer/menu-items` - Browse menu items
- `GET /api/customer/menu-items/{id}` - Get menu item details
- `GET /api/customer/orders` - Get customer orders
- `GET /api/customer/orders/{id}` - Get order details
- `GET /api/customer/addresses` - Get customer addresses

#### Customer Flow

```
Registration → Profile Creation → Browse Menu → Add to Cart →
Place Order → Make Payment → Track Order → Receive Delivery → Rate & Review
```

---

### 6.3 Module 3 – Provider Module

#### Overview

The Provider Module enables food providers (tiffin services) to manage their business on the platform. It includes provider registration, profile management, menu item management, order processing, and business analytics.

#### Key Features

- **Provider Registration**: Register as a food provider
- **Profile Management**: Create and manage business profile
- **Admin Verification**: Provider approval workflow by admin
- **Menu Item Management**: Create, update, delete menu items (only after approval)
- **Category Assignment**: Assign menu items to categories
- **Availability Management**: Mark items as available/unavailable
- **Order Management**: View, accept, reject, and update order status
- **Order Status Updates**: Update order preparation status (Preparing → Ready)
- **Business Analytics**: View order statistics and revenue
- **Rating Management**: View customer ratings and reviews

#### Components

- **ProviderController**: Handles `/api/provider/*` endpoints
- **TiffinProviderService**: Business logic for provider operations
- **TiffinProviderRepository**: Data access for provider entities
- **ProviderDashboardActivity**: Android provider dashboard
- **AddProductActivity**: Add/edit menu items screen
- **ProviderOrdersActivity**: Provider orders management screen

#### Provider States

1. **Pending**: Profile created, awaiting admin approval
2. **Approved**: Admin verified, can create menu items
3. **Rejected**: Admin rejected the provider

#### API Endpoints

- `POST /api/provider/profile` - Create provider profile
- `GET /api/provider/profile` - Get provider profile
- `PUT /api/provider/profile` - Update provider profile
- `POST /api/provider/menu-items` - Create menu item
- `GET /api/provider/menu-items` - Get provider menu items
- `PUT /api/provider/menu-items/{id}` - Update menu item
- `DELETE /api/provider/menu-items/{id}` - Delete menu item
- `GET /api/provider/orders` - Get provider orders
- `PUT /api/provider/orders/{id}/status` - Update order status

#### Provider Flow

```
Registration → Profile Creation → Admin Approval → Create Menu Items →
Receive Orders → Accept Orders → Prepare Food → Update Status → Complete Order
```

---

### 6.4 Module 4 – Delivery Partner Module

#### Overview

The Delivery Partner Module manages delivery operations, including delivery partner registration, order assignment, delivery tracking, and status updates. It ensures efficient order delivery from providers to customers.

#### Key Features

- **Delivery Partner Registration**: Register as a delivery partner
- **Profile Management**: Create and manage delivery partner profile
- **Availability Management**: Set availability status (available/unavailable)
- **Order Assignment**: Receive orders assigned by admin
- **Order Acceptance**: Accept or reject assigned orders
- **Delivery Tracking**: Update delivery status (Out for Delivery → Delivered)
- **Route Management**: View pickup and delivery addresses
- **Earnings Tracking**: View delivery earnings and statistics
- **Vehicle Information**: Manage vehicle and license details

#### Components

- **DeliveryPartnerController**: Handles `/api/delivery-partner/*` endpoints
- **DeliveryPartnerService**: Business logic for delivery operations
- **DeliveryPartnerRepository**: Data access for delivery partner entities
- **DeliveryPartnerDashboardActivity**: Android delivery partner dashboard
- **DeliveryPartnerOrderDetailActivity**: Order details for delivery

#### Order Status Flow (Delivery Partner)

```
READY (Provider marks ready) → Assigned by Admin →
OUT_FOR_DELIVERY (Delivery partner picks up) → DELIVERED (Delivery completed)
```

#### API Endpoints

- `POST /api/delivery-partner/profile` - Create delivery partner profile
- `GET /api/delivery-partner/profile` - Get delivery partner profile
- `PUT /api/delivery-partner/profile` - Update profile
- `PUT /api/delivery-partner/availability` - Set availability
- `GET /api/delivery-partner/orders` - Get assigned orders
- `PUT /api/delivery-partner/orders/{id}/status` - Update delivery status

#### Delivery Partner Flow

```
Registration → Profile Creation → Set Availability → Receive Order Assignment →
Accept Order → Pick Up Order → Update Status → Deliver Order → Complete Delivery
```

---

### 6.5 Module 5 – Admin Module

#### Overview

The Admin Module provides comprehensive administrative capabilities for platform management. It includes user management, provider verification, category management, order oversight, delivery partner assignment, and system analytics.

#### Key Features

- **User Management**: View, create, update, delete all users
- **Provider Verification**: Approve or reject provider registrations
- **Category Management**: Create, update, delete food categories
- **Order Management**: View all orders across the platform
- **Delivery Partner Assignment**: Assign delivery partners to orders
- **Delivery Zone Management**: Define and manage delivery zones
- **Payout Management**: Process payouts to providers
- **System Analytics**: View platform statistics and metrics
- **Dashboard Overview**: Comprehensive dashboard with key metrics

#### Components

- **AdminDashboardController**: Handles `/api/admin/*` endpoints
- **AdminTiffinProviderController**: Provider management endpoints
- **DashboardService**: Business logic for admin operations
- **Admin Web Panel**: Web-based administrative interface

#### Admin Capabilities

- Full CRUD operations on all entities
- Provider approval/rejection
- Order assignment to delivery partners
- System-wide analytics and reporting
- User role management
- Category and delivery zone management

#### API Endpoints

- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/providers` - Get all providers
- `PUT /api/admin/providers/{id}/verify` - Verify provider
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/{id}/assign-delivery-partner` - Assign delivery partner
- `GET /api/admin/categories` - Get all categories
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/{id}` - Update category
- `DELETE /api/admin/categories/{id}` - Delete category

#### Admin Flow

```
Login → Dashboard → Manage Users → Verify Providers → Manage Categories →
Monitor Orders → Assign Delivery Partners → Process Payouts → System Analytics
```

---

### 6.6 Module 6 – Order Management Module

#### Overview

The Order Management Module handles the complete order lifecycle from creation to delivery. It coordinates between customers, providers, and delivery partners to ensure smooth order processing.

#### Key Features

- **Order Creation**: Create orders from cart items
- **Order Validation**: Validate order items, addresses, and availability
- **Order Status Management**: Track order status through lifecycle
- **Order Assignment**: Assign delivery partners to orders
- **Order History**: Maintain complete order history
- **Order Notifications**: Notify stakeholders of status changes
- **Order Calculations**: Calculate totals, delivery fees, and commissions
- **Multi-Provider Orders**: Handle orders from multiple providers (if needed)

#### Order Status Flow

```
PENDING → ACCEPTED → PREPARING → READY →
OUT_FOR_DELIVERY → DELIVERED → COMPLETED
```

#### Components

- **OrderController**: Handles `/api/orders/*` endpoints
- **OrderService**: Business logic for order processing
- **OrderRepository**: Data access for order entities
- **Order Model**: Order entity with relationships

#### API Endpoints

- `POST /api/orders` - Create order
- `GET /api/orders/{id}` - Get order details
- `GET /api/orders` - Get orders (filtered by role)
- `PUT /api/orders/{id}/status` - Update order status
- `PUT /api/orders/{id}/assign-delivery-partner` - Assign delivery partner

#### Order Lifecycle

```
Customer Places Order → Provider Accepts → Provider Prepares →
Provider Marks Ready → Admin Assigns Delivery Partner →
Delivery Partner Picks Up → Delivery Partner Delivers → Order Completed
```

---

### 6.7 Module 7 – Payment Module

#### Overview

The Payment Module integrates with Razorpay payment gateway to handle secure payment processing. It manages payment transactions, payment verification, and payment status tracking.

#### Key Features

- **Payment Initiation**: Create payment orders via Razorpay
- **Payment Processing**: Process payments through Razorpay gateway
- **Payment Verification**: Verify payment success/failure
- **Payment Status Tracking**: Track payment status (Pending, Success, Failed, Refunded)
- **Webhook Handling**: Process Razorpay webhook notifications
- **Payment History**: Maintain payment transaction history
- **Refund Processing**: Handle payment refunds (if needed)
- **Multiple Payment Methods**: Support various payment methods through Razorpay

#### Components

- **PaymentController**: Handles `/api/payments/*` endpoints
- **PaymentService**: Business logic for payment processing
- **PaymentRepository**: Data access for payment entities
- **RazorpayConfig**: Razorpay configuration
- **WebhookController**: Handles Razorpay webhooks

#### Payment Flow

```
Order Created → Initiate Payment → Razorpay Payment Gateway →
Customer Pays → Payment Verification → Payment Confirmed →
Order Confirmed → Update Order Status
```

#### API Endpoints

- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/{id}` - Get payment details
- `GET /api/payments/order/{orderId}` - Get payment by order ID
- `POST /api/webhooks/razorpay` - Razorpay webhook handler

#### Payment Statuses

- **PENDING**: Payment initiated but not completed
- **SUCCESS**: Payment completed successfully
- **FAILED**: Payment failed
- **REFUNDED**: Payment refunded

---

### 6.8 Module 8 – Cart Management Module

#### Overview

The Cart Management Module handles shopping cart operations, allowing customers to add, update, and manage items before placing an order. It maintains cart state and calculates totals.

#### Key Features

- **Add to Cart**: Add menu items to shopping cart
- **Update Quantity**: Increase or decrease item quantities
- **Remove from Cart**: Remove items from cart
- **View Cart**: Display all cart items with details
- **Cart Calculations**: Calculate subtotal, delivery fee, and total
- **Cart Persistence**: Maintain cart across sessions
- **Cart Validation**: Validate cart items before checkout
- **Empty Cart**: Clear cart after order placement

#### Components

- **CartController**: Handles `/api/cart/*` endpoints
- **CartService**: Business logic for cart operations
- **CartRepository**: Data access for cart entities
- **CartActivity**: Android cart screen
- **CartAdapter**: RecyclerView adapter for cart items

#### API Endpoints

- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/{cartItemId}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

#### Cart Operations Flow

```
Browse Menu → Select Item → Add to Cart → View Cart →
Update Quantities → Remove Items → Proceed to Checkout →
Create Order → Clear Cart
```

---

### 6.9 Module 9 – Menu Management Module

#### Overview

The Menu Management Module enables providers to manage their menu items, including creation, updates, categorization, and availability management. It also handles menu item display for customers.

#### Key Features

- **Menu Item Creation**: Create new menu items with details
- **Menu Item Updates**: Update item information, prices, descriptions
- **Menu Item Deletion**: Remove items from menu
- **Image Management**: Upload and manage menu item images
- **Category Assignment**: Assign items to food categories
- **Meal Type Classification**: Classify items by meal type (Breakfast, Lunch, Dinner, Snacks)
- **Availability Toggle**: Mark items as available/unavailable
- **Menu Browsing**: Display menu items to customers
- **Search & Filter**: Search and filter menu items

#### Components

- **MenuItemController**: Handles `/api/menu-items/*` endpoints
- **MenuItemService**: Business logic for menu operations
- **MenuItemRepository**: Data access for menu item entities
- **CategoryController**: Handles category management
- **ImageController**: Handles image uploads

#### API Endpoints

- `POST /api/menu-items` - Create menu item
- `GET /api/menu-items` - Get menu items (with filters)
- `GET /api/menu-items/{id}` - Get menu item details
- `PUT /api/menu-items/{id}` - Update menu item
- `DELETE /api/menu-items/{id}` - Delete menu item
- `GET /api/categories` - Get all categories

#### Menu Item Fields

- Name, Description, Price
- Category, Meal Type
- Availability Status
- Images
- Provider Information

---

### 6.10 Module 10 – Address Management Module

#### Overview

The Address Management Module manages customer delivery addresses, enabling customers to save multiple addresses and select delivery addresses during checkout.

#### Key Features

- **Add Address**: Add new delivery addresses
- **Update Address**: Modify existing addresses
- **Delete Address**: Remove addresses
- **List Addresses**: View all saved addresses
- **Address Types**: Support for Home, Work, Other address types
- **Default Address**: Set default delivery address
- **Address Validation**: Validate addresses against delivery zones
- **Delivery Zone Check**: Verify if address is within delivery zone

#### Components

- **AddressController**: Handles `/api/addresses/*` endpoints
- **AddressService**: Business logic for address operations
- **AddressRepository**: Data access for address entities
- **AddressDialog**: Android address input dialog

#### API Endpoints

- `POST /api/addresses` - Add address
- `GET /api/addresses` - Get user addresses
- `GET /api/addresses/{id}` - Get address details
- `PUT /api/addresses/{id}` - Update address
- `DELETE /api/addresses/{id}` - Delete address

#### Address Fields

- Address Type (Home/Work/Other)
- Full Address
- City, State, Pincode
- Landmark (optional)
- Contact Number

---

### 6.11 Module 11 – Rating & Review Module

#### Overview

The Rating & Review Module allows customers to provide feedback on providers and menu items through ratings and reviews. It helps maintain quality and build trust in the platform.

#### Key Features

- **Rate Providers**: Rate food providers (1-5 stars)
- **Rate Menu Items**: Rate individual menu items
- **Write Reviews**: Add detailed text reviews
- **View Ratings**: Display average ratings and reviews
- **Review Management**: View and manage reviews
- **Rating Statistics**: Calculate average ratings
- **Review Display**: Show reviews on product/provider pages

#### Components

- **RatingReviewController**: Handles `/api/ratings/*` endpoints
- **RatingReviewService**: Business logic for rating operations
- **RatingReviewRepository**: Data access for rating entities
- **RatingDialog**: Android rating input dialog
- **ReviewAdapter**: Display reviews in RecyclerView

#### API Endpoints

- `POST /api/ratings` - Submit rating and review
- `GET /api/ratings/provider/{providerId}` - Get provider ratings
- `GET /api/ratings/menu-item/{menuItemId}` - Get menu item ratings
- `GET /api/ratings/order/{orderId}` - Get rating for order

#### Rating System

- **Rating Scale**: 1 to 5 stars
- **Review Types**: Provider rating, Menu item rating
- **Display**: Average rating with review count
- **Validation**: One rating per order

---

### 6.12 Module Integration

All modules work together to provide a seamless food delivery experience:

```
Authentication Module (Foundation)
    ↓
Customer Module ↔ Cart Module ↔ Menu Module
    ↓
Order Module ↔ Payment Module
    ↓
Provider Module ↔ Delivery Partner Module
    ↓
Admin Module (Oversight)
```

**Module Interactions:**

- **Customer Module** uses **Cart Module** to manage items
- **Cart Module** uses **Menu Module** to fetch item details
- **Order Module** coordinates with **Payment Module** for transactions
- **Provider Module** receives orders from **Order Module**
- **Admin Module** manages all other modules
- **Delivery Partner Module** completes orders from **Order Module**

---

## 7. Implementation

### 7.1 Important Code Snippets

This section highlights key code implementations that demonstrate the core functionality of the PlateMate system.

#### 7.1.1 Backend Code Snippets

**1. JWT Token Generation and Validation**

```java
// JwtUtil.java - JWT Token Management
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.token.expiration}")
    private long tokenExpiration;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + tokenExpiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isExpired(token);
    }
}
```

**2. User Authentication Controller**

```java
// AuthController.java - Login Endpoint
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        // Generate tokens
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String token = jwtUtil.generateToken(userDetails);
        String refreshToken = jwtUtil.generateRefreshToken(userDetails);

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("refreshToken", refreshToken);
        response.put("username", username);
        response.put("role", formatRoleForClient(user.getRole()));
        response.put("userId", user.getId());

        return ResponseEntity.ok(response);
    }
}
```

**3. Order Creation Service**

```java
// OrderService.java - Order Creation Logic
@Service
public class OrderService {

    @Transactional
    public Order createOrder(Long customerId, OrderDtos.CreateRequest req) {
        // Validate customer
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        // Validate cart items
        List<Cart> cartItems = cartService.validateCartItems(customerId, req.getCartItemIds());

        // Validate all items from same provider
        Long providerId = cartItems.get(0).getMenuItem().getProvider().getId();
        for (Cart cart : cartItems) {
            if (!cart.getMenuItem().getProvider().getId().equals(providerId)) {
                throw new BadRequestException("All cart items must be from the same provider");
            }
        }

        // Get provider and validate
        TiffinProvider provider = tiffinProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (!Boolean.TRUE.equals(provider.getIsVerified())) {
            throw new BadRequestException("Provider is not verified");
        }

        // Calculate totals
        double subtotal = cartItems.stream()
                .mapToDouble(c -> c.getPrice() * c.getQuantity())
                .sum();

        double deliveryFee = calculateDeliveryFee(req.getDeliveryAddress());
        double platformCommission = subtotal * 0.10; // 10% commission
        double totalAmount = subtotal + deliveryFee + platformCommission;

        // Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setProvider(provider);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setTotalAmount(totalAmount);
        order.setDeliveryFee(deliveryFee);
        order.setPlatformCommission(platformCommission);
        order.setDeliveryAddress(req.getDeliveryAddress());
        order.setCartItemIds(objectMapper.writeValueAsString(req.getCartItemIds()));
        order.setOrderTime(LocalDateTime.now());

        return orderRepository.save(order);
    }
}
```

**4. Payment Processing with Razorpay**

```java
// PaymentService.java - Razorpay Integration
@Service
public class PaymentService {

    @Autowired
    private RazorpayProperties props;

    public Map<String, Object> createRazorpayOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        double amount = order.getTotalAmount();

        // Create Razorpay order
        Map<String, Object> razorpayOrder = new HashMap<>();
        razorpayOrder.put("amount", (int)(amount * 100)); // Convert to paise
        razorpayOrder.put("currency", props.getCurrency());
        razorpayOrder.put("receipt", "order_" + orderId);

        // Call Razorpay API
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(props.getKeyId(), props.getKeySecret());

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(razorpayOrder, headers);
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> response = restTemplate.postForObject(
                RAZORPAY_API_BASE + "/orders",
                request,
                Map.class
        );

        // Save payment record
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(amount);
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setRazorpayOrderId((String) response.get("id"));
        paymentRepository.save(payment);

        return response;
    }

    public boolean verifyPayment(String razorpayOrderId, String razorpayPaymentId, String signature) {
        String payload = razorpayOrderId + "|" + razorpayPaymentId;
        String calculatedSignature = calculateHMAC(payload, props.getKeySecret());
        return calculatedSignature.equals(signature);
    }
}
```

**5. JWT Filter for Request Authentication**

```java
// JwtFilter.java - Request Interceptor
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String username = jwtUtil.extractUsername(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                        );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                // Token validation failed
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

#### 7.1.2 Android Code Snippets

**1. Retrofit Client with JWT Token Interceptor**

```java
// RetrofitClient.java - Network Client Setup
public class RetrofitClient {
    private static final String BASE_URL = "http://192.168.43.65:8080";
    private static RetrofitClient instance;
    private Retrofit retrofit;
    private SessionManager sessionManager;

    private RetrofitClient(Context context) {
        sessionManager = new SessionManager(context);

        OkHttpClient okHttpClient = new OkHttpClient.Builder()
            .addInterceptor(new AuthInterceptor(sessionManager))
            .addInterceptor(new TokenRefreshInterceptor(sessionManager))
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();

        retrofit = new Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build();
    }

    // Auth Interceptor - adds token to requests
    private static class AuthInterceptor implements Interceptor {
        private SessionManager sessionManager;

        @Override
        public Response intercept(Chain chain) throws IOException {
            Request original = chain.request();
            String token = sessionManager.getToken();

            Request.Builder requestBuilder = original.newBuilder();
            if (token != null) {
                requestBuilder.addHeader("Authorization", "Bearer " + token);
            }

            return chain.proceed(requestBuilder.build());
        }
    }
}
```

**2. Session Management**

```java
// SessionManager.java - Local Storage Management
public class SessionManager {
    private static final String PREF_NAME = "user_session";
    private static final String KEY_TOKEN = "auth_token";
    private static final String KEY_REFRESH_TOKEN = "refresh_token";
    private static final String KEY_ROLE = "user_role";
    private static final String KEY_USER_ID = "user_id";

    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        Context appCtx = context.getApplicationContext();
        prefs = appCtx.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    public void saveLoginSession(String token, String refreshToken,
                                 String role, String username, Long userId) {
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.putString(KEY_TOKEN, token);
        editor.putString(KEY_REFRESH_TOKEN, refreshToken);
        editor.putString(KEY_ROLE, role);
        editor.putString(KEY_USERNAME, username);
        editor.putLong(KEY_USER_ID, userId);
        editor.apply();
    }

    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    public void logout() {
        editor.clear();
        editor.apply();
    }
}
```

**3. Login Activity Implementation**

```java
// LoginActivity.java - User Authentication
public class LoginActivity extends AppCompatActivity {
    private EditText usernameEditText;
    private EditText passwordEditText;
    private ApiInterface apiInterface;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sessionManager = new SessionManager(this);
        apiInterface = RetrofitClient.getInstance(this).getApi();

        Button loginButton = findViewById(R.id.loginButton);
        loginButton.setOnClickListener(v -> performLogin());
    }

    private void performLogin() {
        String username = usernameEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString();

        LoginInputDetails loginDetails = new LoginInputDetails(username, password);

        Call<LoginUserDetails> call = apiInterface.login(loginDetails);
        call.enqueue(new Callback<LoginUserDetails>() {
            @Override
            public void onResponse(Call<LoginUserDetails> call, Response<LoginUserDetails> response) {
                if (response.isSuccessful() && response.body() != null) {
                    LoginUserDetails userDetails = response.body();

                    // Save session
                    sessionManager.saveLoginSession(
                        userDetails.getToken(),
                        userDetails.getRefreshToken(),
                        userDetails.getRole(),
                        userDetails.getUsername(),
                        userDetails.getUserId()
                    );

                    // Navigate based on role
                    navigateToDashboard(userDetails.getRole());
                } else {
                    ToastUtils.showToast(LoginActivity.this, "Login failed");
                }
            }

            @Override
            public void onFailure(Call<LoginUserDetails> call, Throwable t) {
                ToastUtils.showToast(LoginActivity.this, "Network error");
            }
        });
    }
}
```

**4. Product Adapter for RecyclerView**

```java
// ProductAdapter.java - List Display
public class ProductAdapter extends RecyclerView.Adapter<ProductAdapter.ViewHolder> {
    private List<Product> products;
    private Context context;

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Product product = products.get(position);

        holder.productName.setText(product.getName());
        holder.productPrice.setText("₹" + product.getPrice());
        holder.productRating.setText(String.valueOf(product.getRating()));

        // Load image using Glide
        String imageUrl = RetrofitClient.getBaseUrl() + "/api/images/" + product.getImageId();
        Glide.with(context)
            .load(imageUrl)
            .placeholder(R.drawable.placeholder)
            .into(holder.productImage);

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, ProductDetailActivity.class);
            intent.putExtra("product_id", product.getId());
            context.startActivity(intent);
        });
    }
}
```

**5. Cart Management**

```java
// CartActivity.java - Shopping Cart
public class CartActivity extends AppCompatActivity {
    private RecyclerView cartRecyclerView;
    private CartAdapter cartAdapter;
    private ApiInterface apiInterface;
    private TextView totalAmountTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_cart);

        apiInterface = RetrofitClient.getInstance(this).getApi();
        loadCartItems();
    }

    private void loadCartItems() {
        Call<List<CartItem>> call = apiInterface.getCart();
        call.enqueue(new Callback<List<CartItem>>() {
            @Override
            public void onResponse(Call<List<CartItem>> call, Response<List<CartItem>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<CartItem> cartItems = response.body();
                    cartAdapter = new CartAdapter(cartItems, CartActivity.this);
                    cartRecyclerView.setAdapter(cartAdapter);
                    calculateTotal(cartItems);
                }
            }

            @Override
            public void onFailure(Call<List<CartItem>> call, Throwable t) {
                ToastUtils.showToast(CartActivity.this, "Failed to load cart");
            }
        });
    }

    private void calculateTotal(List<CartItem> items) {
        double total = items.stream()
            .mapToDouble(item -> item.getPrice() * item.getQuantity())
            .sum();
        totalAmountTextView.setText("Total: ₹" + total);
    }
}
```

### 7.2 App Permissions

The Android application requires specific permissions to function properly. All permissions are declared in the `AndroidManifest.xml` file.

#### 7.2.1 Required Permissions

**1. Internet Permission**

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

- **Purpose**: Required for making HTTP/HTTPS requests to the backend API
- **Usage**: All network operations including API calls, image loading, payment processing
- **Required**: Yes (Mandatory)

**2. Read Media Images Permission**

```xml
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
```

- **Purpose**: Access images from device storage for profile pictures and menu item images
- **Usage**: When users upload profile pictures or menu item images
- **Required**: Yes (For Android 13+)

**3. Read External Storage Permission**

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
    android:maxSdkVersion="32" />
```

- **Purpose**: Access images from device storage (for Android versions below 13)
- **Usage**: Reading images from device gallery
- **Required**: Yes (For Android 12 and below)
- **Note**: `maxSdkVersion="32"` limits this permission to Android 12 and below

#### 7.2.2 Permission Usage by Feature

| Feature                    | Permissions Required                      | Runtime Request           |
| -------------------------- | ----------------------------------------- | ------------------------- |
| **API Calls**              | INTERNET                                  | No (declared in manifest) |
| **Image Loading**          | INTERNET                                  | No                        |
| **Profile Picture Upload** | READ_MEDIA_IMAGES / READ_EXTERNAL_STORAGE | Yes (Android 6.0+)        |
| **Menu Item Image Upload** | READ_MEDIA_IMAGES / READ_EXTERNAL_STORAGE | Yes (Android 6.0+)        |
| **Payment Processing**     | INTERNET                                  | No                        |

#### 7.2.3 Runtime Permission Handling

For Android 6.0 (API 23) and above, dangerous permissions require runtime requests:

```java
// Example: Requesting storage permission
private void requestStoragePermission() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        // Android 13+ - Use READ_MEDIA_IMAGES
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_MEDIA_IMAGES},
                    REQUEST_CODE_STORAGE);
        }
    } else {
        // Android 12 and below - Use READ_EXTERNAL_STORAGE
        if (ContextCompat.checkSelfPermission(this,
                Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.READ_EXTERNAL_STORAGE},
                    REQUEST_CODE_STORAGE);
        }
    }
}
```

#### 7.2.4 Network Security Configuration

The app includes network security configuration to allow cleartext traffic (for development):

```xml
android:networkSecurityConfig="@xml/network_security_config"
android:usesCleartextTraffic="true"
```

**Note**: In production, `usesCleartextTraffic` should be set to `false` and HTTPS should be used exclusively.

### 7.3 Data Handling & Processing

#### 7.3.1 Data Flow Architecture

The PlateMate system follows a layered architecture for data handling:

```
Android App (Presentation Layer)
    ↓
Retrofit Client (Network Layer)
    ↓
Spring Boot REST API (Application Layer)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
PostgreSQL Database (Data Layer)
```

#### 7.3.2 Request-Response Flow

**1. Authentication Flow**

```
User Input (Login Credentials)
    ↓
LoginActivity → Retrofit API Call
    ↓
POST /api/auth/login
    ↓
AuthController → AuthenticationManager
    ↓
UserService → UserRepository
    ↓
Database Query → User Entity
    ↓
JWT Token Generation
    ↓
Response: {token, refreshToken, role, userId}
    ↓
SessionManager.saveLoginSession()
    ↓
Navigate to Dashboard
```

**2. Order Creation Flow**

```
Customer Adds Items to Cart
    ↓
CartActivity → Add to Cart API
    ↓
POST /api/cart/add
    ↓
CartController → CartService
    ↓
CartRepository.save() → Database
    ↓
Customer Proceeds to Checkout
    ↓
CheckoutActivity → Create Order API
    ↓
POST /api/orders
    ↓
OrderController → OrderService.createOrder()
    ↓
Validation:
  - Customer exists
  - Cart items valid
  - All items from same provider
  - Provider verified
    ↓
Calculate Totals:
  - Subtotal
  - Delivery Fee
  - Platform Commission
  - Total Amount
    ↓
OrderRepository.save() → Database
    ↓
Payment Initiation
    ↓
POST /api/payments/create-order
    ↓
PaymentService → Razorpay API
    ↓
Payment Record Saved
    ↓
Response: Razorpay Order Details
    ↓
Customer Completes Payment
    ↓
POST /api/payments/verify
    ↓
Payment Verification
    ↓
Order Status: PENDING → ACCEPTED
```

**3. Image Upload Flow**

```
User Selects Image
    ↓
Image Picker → File Selection
    ↓
Convert to MultipartFile
    ↓
POST /api/images/upload
    ↓
ImageController → ImageService
    ↓
Image Processing:
  - Validate file type
  - Validate file size
  - Generate unique filename
  - Save to storage
    ↓
ImageRepository.save() → Database
    ↓
Response: Image URL/ID
    ↓
Use Image ID in Menu Item/Profile
```

#### 7.3.3 Data Validation

**Backend Validation:**

```java
// Example: Order Creation Validation
@Transactional
public Order createOrder(Long customerId, OrderDtos.CreateRequest req) {
    // 1. Validate customer exists
    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

    // 2. Validate delivery address
    if (req.getDeliveryAddress() == null || req.getDeliveryAddress().trim().isEmpty()) {
        throw new BadRequestException("Delivery address is required");
    }

    // 3. Validate cart items exist
    if (req.getCartItemIds() == null || req.getCartItemIds().isEmpty()) {
        throw new BadRequestException("Cart item IDs cannot be empty");
    }

    // 4. Validate all items from same provider
    List<Cart> cartItems = cartService.validateCartItems(customerId, req.getCartItemIds());
    Long providerId = cartItems.get(0).getMenuItem().getProvider().getId();
    for (Cart cart : cartItems) {
        if (!cart.getMenuItem().getProvider().getId().equals(providerId)) {
            throw new BadRequestException("All cart items must be from the same provider");
        }
    }

    // 5. Validate provider is verified
    TiffinProvider provider = tiffinProviderRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

    if (!Boolean.TRUE.equals(provider.getIsVerified())) {
        throw new BadRequestException("Provider is not verified");
    }

    // Proceed with order creation...
}
```

#### 7.3.4 Error Handling

**Backend Error Handling:**

```java
// GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
```

**Android Error Handling:**

```java
// Retrofit Callback with Error Handling
call.enqueue(new Callback<ResponseType>() {
    @Override
    public void onResponse(Call<ResponseType> call, Response<ResponseType> response) {
        if (response.isSuccessful() && response.body() != null) {
            // Handle success
        } else {
            // Handle API error
            try {
                ErrorResponse error = new Gson().fromJson(
                    response.errorBody().string(),
                    ErrorResponse.class
                );
                ToastUtils.showToast(context, error.getMessage());
            } catch (IOException e) {
                ToastUtils.showToast(context, "An error occurred");
            }
        }
    }

    @Override
    public void onFailure(Call<ResponseType> call, Throwable t) {
        // Handle network error
        ToastUtils.showToast(context, "Network error: " + t.getMessage());
    }
});
```

#### 7.3.5 Data Persistence

**Backend:**

- **Database**: PostgreSQL for persistent storage
- **Transactions**: `@Transactional` annotations ensure data consistency
- **Cascade Operations**: Automatic handling of related entities

**Android:**

- **SharedPreferences**: Session data (tokens, user info)
- **No Local Database**: All data fetched from API in real-time
- **Image Caching**: Glide library handles automatic image caching

#### 7.3.6 Security Measures

1. **Password Encryption**: BCrypt hashing for passwords
2. **JWT Tokens**: Secure token-based authentication
3. **HTTPS**: Secure communication (production)
4. **Input Validation**: Server-side validation for all inputs
5. **SQL Injection Prevention**: JPA/Hibernate parameterized queries
6. **XSS Prevention**: Input sanitization
7. **CORS Configuration**: Controlled cross-origin requests

---

## 8. Testing

### 8.1 Test Cases

The PlateMate system has been tested across all modules to ensure functionality, reliability, and security. This section documents the test cases organized by module and their results.

#### 8.1.1 Authentication Module Test Cases

| **ID**   | **Test Case**             | **Steps**                              | **Expected Result**             | **Status** |
| -------- | ------------------------- | -------------------------------------- | ------------------------------- | ---------- |
| AUTH-001 | Registration – Valid      | POST `/signup` with valid data         | User created; returns ID + name | ✅ PASS    |
| AUTH-002 | Duplicate Username        | Re-register with same username         | 409 – Username exists           | ✅ PASS    |
| AUTH-003 | Duplicate Email           | Re-register with same email            | 409 – Email exists              | ✅ PASS    |
| AUTH-004 | Invalid Role              | Signup with invalid role               | Defaults to CUSTOMER            | ✅ PASS    |
| AUTH-005 | Login – Valid             | POST `/login` with correct credentials | Returns JWT + refresh token     | ✅ PASS    |
| AUTH-006 | Login – Wrong Password    | Login with wrong password              | 401 – Bad credentials           | ✅ PASS    |
| AUTH-007 | Login – No User           | Login with unknown username            | 401 – Bad credentials           | ✅ PASS    |
| AUTH-008 | Refresh Token – Valid     | POST `/refresh` with valid token       | New access + refresh token      | ✅ PASS    |
| AUTH-009 | Refresh Token – Expired   | Use expired refresh token              | 401 – Token expired             | ✅ PASS    |
| AUTH-010 | Protected – Valid Token   | Access endpoint with valid JWT         | Access granted                  | ✅ PASS    |
| AUTH-011 | Protected – Invalid Token | Access with invalid/malformed token    | 401 – Unauthorized              | ✅ PASS    |
| AUTH-012 | Protected – No Token      | Access without token                   | 401 – Unauthorized              | ✅ PASS    |

#### 8.1.2 Customer Module Test Cases

| **Test ID** | **Test Case**              | **Test Steps**                    | **Expected Result**        | **Status** |
| ----------- | -------------------------- | --------------------------------- | -------------------------- | ---------- |
| CUST-001    | Create Customer Profile    | POST `/customer/profile`          | Profile created            | ✅ PASS    |
| CUST-002    | Get Profile                | GET `/customer/profile`           | Returns profile            | ✅ PASS    |
| CUST-003    | Update Profile             | PUT `/customer/profile`           | Profile updated            | ✅ PASS    |
| CUST-004    | Browse Menu                | GET `/customer/menu-items`        | Returns menu list          | ✅ PASS    |
| CUST-005    | Menu Item Details          | GET `/customer/menu-items/{id}`   | Returns details            | ✅ PASS    |
| CUST-006    | Search Menu                | GET with query params             | Returns filtered list      | ✅ PASS    |
| CUST-007    | Add to Cart                | POST `/cart/add`                  | Item added                 | ✅ PASS    |
| CUST-008    | View Cart                  | GET `/cart`                       | Shows cart items           | ✅ PASS    |
| CUST-009    | Update Cart Item           | PUT `/cart/update`                | Quantity updated           | ✅ PASS    |
| CUST-010    | Remove Cart Item           | DELETE `/cart/remove/{id}`        | Item removed               | ✅ PASS    |
| CUST-011    | Add Address                | POST `/addresses`                 | Address created            | ✅ PASS    |
| CUST-012    | Get Addresses              | GET `/addresses`                  | Returns saved addresses    | ✅ PASS    |
| CUST-013    | Create Order               | POST `/orders`                    | Order created with PENDING | ✅ PASS    |
| CUST-014    | Create Order – Empty Cart  | Create with empty cart            | Error 400                  | ✅ PASS    |
| CUST-015    | Order with Mixed Providers | Add items from multiple providers | Error 400                  | ✅ PASS    |
| CUST-016    | Get Customer Orders        | GET `/customer/orders`            | Returns order list         | ✅ PASS    |
| CUST-017    | Order Details              | GET `/orders/{id}`                | Returns detailed order     | ✅ PASS    |
| CUST-018    | Rate Provider              | POST `/ratings`                   | Rating submitted           | ✅ PASS    |

#### 8.1.3 Provider Module Test Cases

| Test ID  | Test Case                | Test Steps                         | Expected Result                   | Status  |
| -------- | ------------------------ | ---------------------------------- | --------------------------------- | ------- |
| PROV-001 | Create Profile           | POST `/provider/profile`           | Profile created; isVerified=false | ✅ PASS |
| PROV-002 | Get Profile              | GET `/provider/profile`            | Returns provider profile          | ✅ PASS |
| PROV-003 | Create Menu – Unverified | POST `/provider/menu-items`        | Error 403                         | ✅ PASS |
| PROV-004 | Create Menu – Verified   | Provider verified → create item    | Item created                      | ✅ PASS |
| PROV-005 | List Menu Items          | GET `/provider/menu-items`         | Returns items                     | ✅ PASS |
| PROV-006 | Update Menu              | PUT `/provider/menu-items/{id}`    | Updated successfully              | ✅ PASS |
| PROV-007 | Delete Menu              | DELETE `/provider/menu-items/{id}` | Item deleted                      | ✅ PASS |
| PROV-008 | Get Provider Orders      | GET `/provider/orders`             | Order list returned               | ✅ PASS |
| PROV-009 | Accept Order             | PUT `/orders/{id}/accept`          | Status → ACCEPTED                 | ✅ PASS |
| PROV-010 | Reject Order             | PUT `/orders/{id}/reject`          | Status → REJECTED                 | ✅ PASS |
| PROV-011 | Update → PREPARING       | Update status                      | Updated                           | ✅ PASS |
| PROV-012 | Update → READY           | Update status                      | Updated                           | ✅ PASS |
| PROV-013 | Upload Image             | POST `/images/upload`              | Image uploaded → ID returned      | ✅ PASS |

#### 8.1.4 Order Management Test Cases

| Test ID | Test Case            | Expected Result                          | Status  |
| ------- | -------------------- | ---------------------------------------- | ------- |
| ORD-001 | Valid Order Creation | Order created (PENDING)                  | ✅ PASS |
| ORD-002 | Missing Address      | Error 400                                | ✅ PASS |
| ORD-003 | Invalid Cart Items   | Error 400                                | ✅ PASS |
| ORD-004 | Status Flow          | All transitions work end-to-end          | ✅ PASS |
| ORD-005 | Get Order by ID      | Returns details                          | ✅ PASS |
| ORD-006 | Invalid Order ID     | Error 404                                | ✅ PASS |
| ORD-007 | Order Calculation    | Correct subtotal + delivery + commission | ✅ PASS |

#### 8.1.5 Payment Module Test Cases

| Test ID | Test Case              | Expected Result                    | Status  |
| ------- | ---------------------- | ---------------------------------- | ------- |
| PAY-001 | Create Razorpay Order  | Razorpay order + DB record created | ✅ PASS |
| PAY-002 | Verify Payment – Valid | Payment SUCCESS → order updated    | ✅ PASS |
| PAY-003 | Invalid Signature      | Error 400                          | ✅ PASS |
| PAY-004 | Get Payment            | Returns transaction                | ✅ PASS |
| PAY-005 | Get Payment by Order   | Returns payment                    | ✅ PASS |
| PAY-006 | Razorpay Webhook       | Payment updated successfully       | ✅ PASS |

#### 8.1.6 Delivery Partner Module Test Cases

| Test ID | Test Case                 | Expected Result    | Status  |
| ------- | ------------------------- | ------------------ | ------- |
| DP-001  | Create DP Profile         | Profile created    | ✅ PASS |
| DP-002  | Set Availability          | Status updated     | ✅ PASS |
| DP-003  | Get Assigned Orders       | List returned      | ✅ PASS |
| DP-004  | Update → OUT_FOR_DELIVERY | Status updated     | ✅ PASS |
| DP-005  | Mark Delivered            | Status → DELIVERED | ✅ PASS |

#### 8.1.7 Admin Module Test Cases

| Test ID | Test Case               | Expected Result                   | Status  |
| ------- | ----------------------- | --------------------------------- | ------- |
| ADM-001 | Dashboard Stats         | Stats returned                    | ✅ PASS |
| ADM-002 | Get Users               | List returned                     | ✅ PASS |
| ADM-003 | Verify Provider         | Provider verified                 | ✅ PASS |
| ADM-004 | Reject Provider         | Provider rejected                 | ✅ PASS |
| ADM-005 | Get Providers           | List returned                     | ✅ PASS |
| ADM-006 | Create Category         | Category created                  | ✅ PASS |
| ADM-007 | Update Category         | Category updated                  | ✅ PASS |
| ADM-008 | Delete Category         | Category deleted                  | ✅ PASS |
| ADM-009 | Get All Orders          | Order list                        | ✅ PASS |
| ADM-010 | Assign Delivery Partner | Partner assigned → status updated | ✅ PASS |
| ADM-011 | Create Delivery Zone    | Zone created                      | ✅ PASS |

#### 8.1.8 Integration Test Cases

| Test ID | Test Case               | Expected Result      | Status  |
| ------- | ----------------------- | -------------------- | ------- |
| INT-001 | Complete Order Flow     | Full workflow passes | ✅ PASS |
| INT-002 | Concurrent Access       | No data corruption   | ✅ PASS |
| INT-003 | Image Upload & Retrieve | Works end-to-end     | ✅ PASS |

#### 8.1.9 Security Test Cases

| Test ID | Test Case           | Expected Result  | Status  |
| ------- | ------------------- | ---------------- | ------- |
| SEC-001 | SQL Injection       | Sanitized → safe | ✅ PASS |
| SEC-002 | XSS                 | Script blocked   | ✅ PASS |
| SEC-003 | Unauthorized Access | Access denied    | ✅ PASS |
| SEC-004 | Token Expiration    | Error 401        | ✅ PASS |
| SEC-005 | Password Encryption | Passwords hashed | ✅ PASS |

### 8.2 Test Results

#### 8.2.1 Test Summary

| Module               | Total Test Cases | Passed | Failed | Pass Rate |
| -------------------- | ---------------- | ------ | ------ | --------- |
| **Authentication**   | 12               | 12     | 0      | 100%      |
| **Customer**         | 18               | 18     | 0      | 100%      |
| **Provider**         | 13               | 13     | 0      | 100%      |
| **Order Management** | 7                | 7      | 0      | 100%      |
| **Payment**          | 6                | 6      | 0      | 100%      |
| **Delivery Partner** | 5                | 5      | 0      | 100%      |
| **Admin**            | 11               | 11     | 0      | 100%      |
| **Integration**      | 3                | 3      | 0      | 100%      |
| **Security**         | 5                | 5      | 0      | 100%      |
| **TOTAL**            | **80**           | **80** | **0**  | **100%**  |

#### 8.2.2 Performance Test Results

| Test Scenario        | Response Time | Status  |
| -------------------- | ------------- | ------- |
| User Login           | < 500ms       | ✅ PASS |
| Get Menu Items       | < 300ms       | ✅ PASS |
| Create Order         | < 800ms       | ✅ PASS |
| Payment Processing   | < 2s          | ✅ PASS |
| Image Upload         | < 1.5s        | ✅ PASS |
| Get Order Details    | < 400ms       | ✅ PASS |
| Dashboard Statistics | < 600ms       | ✅ PASS |

#### 8.2.3 API Endpoint Test Coverage

- **Authentication Endpoints**: 100% coverage
- **Customer Endpoints**: 100% coverage
- **Provider Endpoints**: 100% coverage
- **Order Endpoints**: 100% coverage
- **Payment Endpoints**: 100% coverage
- **Admin Endpoints**: 100% coverage
- **Delivery Partner Endpoints**: 100% coverage

#### 8.2.4 Browser Compatibility (Admin Panel)

| Browser         | Version | Status  |
| --------------- | ------- | ------- |
| Google Chrome   | Latest  | ✅ PASS |
| Mozilla Firefox | Latest  | ✅ PASS |
| Microsoft Edge  | Latest  | ✅ PASS |
| Safari          | Latest  | ✅ PASS |

#### 8.2.5 Android Device Testing

| Device Type          | Android Version | Status  |
| -------------------- | --------------- | ------- |
| Samsung Galaxy S21   | Android 12      | ✅ PASS |
| OnePlus 9            | Android 11      | ✅ PASS |
| Xiaomi Redmi Note 10 | Android 10      | ✅ PASS |
| Google Pixel 5       | Android 13      | ✅ PASS |
| Emulator (API 24)    | Android 7.0     | ✅ PASS |

#### 8.2.6 Test Environment

- **Backend Server**: Spring Boot 3.5.6 on Java 21
- **Database**: PostgreSQL 14
- **API Testing Tool**: Postman
- **Android Testing**: Physical devices and emulators
- **Network**: Local network and production-like environment

#### 8.2.7 Known Issues and Limitations

1. **Image Upload Size Limit**: Maximum file size is 10MB (by design)
2. **Token Expiration**: Access tokens expire after 24 hours (refresh token valid for 7 days)
3. **Concurrent Order Updates**: Order status updates are sequential to prevent conflicts
4. **Payment Gateway**: Test mode used for development; production requires live credentials

#### 8.2.8 Test Conclusion

All test cases have been executed successfully with a **100% pass rate**. The system demonstrates:

- ✅ **Functional Correctness**: All features work as expected
- ✅ **Security**: Proper authentication, authorization, and data protection
- ✅ **Performance**: Acceptable response times for all operations
- ✅ **Reliability**: System handles errors gracefully
- ✅ **Compatibility**: Works across different devices and browsers
- ✅ **Integration**: All modules work together seamlessly

The PlateMate system is **ready for deployment** and meets all functional and non-functional requirements.

---

## 9. Conclusion

### 9.1 Summary

PlateMate is a comprehensive home-made food delivery system that successfully addresses the gap in the market for specialized platforms catering to home-based food providers. The project has been successfully developed and tested, demonstrating a complete end-to-end solution for the food delivery ecosystem.

#### 9.1.1 Project Achievement

The PlateMate system has achieved all its primary objectives:

1. **Successfully Connected Providers and Customers**: The platform provides a digital marketplace where home-based food providers can showcase their offerings and customers can easily discover and order authentic home-cooked meals.

2. **Implemented Complete Order Management**: A robust order management system handles the entire order lifecycle from creation to delivery, with real-time status tracking and efficient coordination between all stakeholders.

3. **Integrated Secure Payment Processing**: Razorpay payment gateway integration ensures secure and seamless financial transactions, building trust between customers and providers.

4. **Enabled Multi-Role Functionality**: The system successfully supports four distinct user roles (Customer, Provider, Delivery Partner, Admin) with appropriate permissions and role-specific features.

5. **Delivered User-Friendly Interfaces**: Both the Android mobile application and admin web panel provide intuitive and modern user experiences using Material Design principles.

6. **Ensured System Security**: JWT-based authentication, role-based access control, and secure data handling protect user information and system integrity.

#### 9.1.2 Technical Achievements

- **Backend Development**: Successfully implemented a scalable Spring Boot REST API with PostgreSQL database, following industry best practices and design patterns.

- **Mobile Application**: Developed a native Android application with modern UI/UX, efficient network handling, and seamless integration with the backend API.

- **Database Design**: Created a well-structured database schema with proper relationships, ensuring data integrity and efficient querying.

- **API Integration**: Successfully integrated third-party services (Razorpay payment gateway) with proper error handling and verification.

- **Testing**: Achieved 100% test case pass rate, ensuring system reliability and correctness.

#### 9.1.3 System Capabilities

The PlateMate system provides:

- **User Management**: Complete user registration, authentication, and profile management for all user types
- **Provider Operations**: Provider registration, verification workflow, menu management, and order processing
- **Customer Operations**: Menu browsing, cart management, order placement, payment processing, and order tracking
- **Delivery Management**: Delivery partner registration, order assignment, and delivery status tracking
- **Administrative Control**: Comprehensive admin dashboard for system management, provider verification, and analytics
- **Payment Processing**: Secure payment transactions through Razorpay integration
- **Rating System**: Customer feedback mechanism for quality assurance

#### 9.1.4 Project Impact

PlateMate addresses real-world problems:

- **For Home-Based Providers**: Lowers entry barriers, provides digital presence, enables business growth
- **For Customers**: Easy discovery of authentic home-cooked meals, convenient ordering, secure payments
- **For Delivery Partners**: Efficient order management, clear earning opportunities
- **For Platform**: Scalable architecture, comprehensive management tools, quality control mechanisms

### 9.2 Limitations

While the PlateMate system is fully functional and ready for deployment, there are certain limitations that should be acknowledged:

#### 9.2.1 Technical Limitations

1. **Single Platform Support**: Currently supports only Android platform. iOS application is not available, limiting the user base to Android users only.

2. **No Real-Time Notifications**: The system does not implement push notifications for order updates. Users must manually refresh to see status changes.

3. **Limited Offline Functionality**: The Android application requires constant internet connectivity. Limited offline capabilities for browsing previously loaded content.

4. **Image Storage**: Images are stored on the server filesystem. No cloud storage integration (AWS S3, Google Cloud Storage) for better scalability.

5. **No Chat/Messaging System**: Direct communication between customers, providers, and delivery partners is not available through the platform.

6. **Single Language Support**: The application supports only English language. No multi-language support for regional languages.

7. **Limited Analytics**: Basic analytics and reporting features. No advanced data analytics, business intelligence, or predictive analytics.

8. **No Recommendation Engine**: The system does not provide personalized recommendations based on user preferences and order history.

9. **Payment Methods**: Currently supports only Razorpay payment gateway. Limited payment method options compared to major platforms.

10. **Delivery Tracking**: Order tracking is status-based only. No real-time GPS tracking of delivery partners.

#### 9.2.2 Functional Limitations

1. **Order Modifications**: Once an order is placed, customers cannot modify or cancel orders through the app. Requires manual intervention.

2. **Bulk Operations**: Limited support for bulk operations (e.g., bulk menu item updates, bulk order processing).

3. **Inventory Management**: No inventory tracking system for providers. Providers must manually manage ingredient availability.

4. **Subscription Plans**: No support for subscription-based meal plans or recurring orders.

5. **Loyalty Program**: No customer loyalty points or reward system implemented.

6. **Provider Analytics**: Limited analytics for providers (basic order statistics only, no detailed business insights).

7. **Delivery Route Optimization**: No automatic route optimization for delivery partners handling multiple orders.

8. **Customer Support**: No in-app customer support or help desk integration.

9. **Refund Processing**: Payment refunds require manual processing. No automated refund workflow.

10. **Multi-Provider Orders**: Orders can only contain items from a single provider. No support for multi-provider orders in a single transaction.

#### 9.2.3 Scalability Limitations

1. **Database Scaling**: Current PostgreSQL setup may require optimization for very large-scale deployments (millions of users).

2. **File Storage**: Server-based file storage may become a bottleneck with high image upload volumes.

3. **API Rate Limiting**: No rate limiting implemented, which could be a concern under high traffic.

4. **Caching Strategy**: Limited caching implementation. May impact performance under high load.

5. **Load Balancing**: Single server deployment. No load balancing or horizontal scaling configuration.

#### 9.2.4 Security Limitations

1. **Two-Factor Authentication**: No 2FA implementation for enhanced security.

2. **API Rate Limiting**: No rate limiting on API endpoints, making the system vulnerable to brute force attacks.

3. **Data Encryption**: While passwords are hashed, sensitive data encryption at rest could be enhanced.

4. **Audit Logging**: Limited audit logging for security events and user actions.

### 9.3 Future Scope

The PlateMate system has a strong foundation and significant potential for future enhancements. The following features and improvements are planned for future releases:

#### 9.3.1 Short-Term Enhancements (Next 6 Months)

1. **Push Notifications**

   - Implement Firebase Cloud Messaging (FCM) for real-time order updates
   - Send notifications for order status changes, payment confirmations, and delivery updates
   - Provider notifications for new orders and customer messages

2. **iOS Application**

   - Develop native iOS application using Swift/SwiftUI
   - Maintain feature parity with Android application
   - Unified codebase using React Native or Flutter (alternative approach)

3. **Enhanced Order Management**

   - Allow customers to cancel orders (within time limit)
   - Order modification before provider acceptance
   - Scheduled orders for future delivery

4. **Improved Search and Discovery**

   - Advanced search filters (price range, rating, distance, cuisine type)
   - Personalized recommendations based on order history
   - Trending items and popular providers section

5. **In-App Chat/Messaging**

   - Real-time chat between customers and providers
   - Delivery partner communication
   - Customer support chat integration

6. **Enhanced Payment Options**
   - Integration with additional payment gateways (Paytm, PhonePe, Google Pay)
   - Cash on Delivery (COD) option
   - Wallet integration

#### 9.3.2 Medium-Term Enhancements (6-12 Months)

1. **Advanced Analytics Dashboard**

   - Business intelligence for providers (sales trends, popular items, peak hours)
   - Customer analytics (ordering patterns, preferences)
   - Admin analytics (platform growth, revenue metrics, user engagement)

2. **Loyalty and Rewards Program**

   - Customer loyalty points system
   - Referral program
   - Discount coupons and promotional offers
   - Provider rewards for high ratings

3. **Subscription and Meal Plans**

   - Weekly/monthly meal subscription plans
   - Customizable meal plans
   - Automatic recurring orders

4. **Real-Time GPS Tracking**

   - Live delivery partner location tracking
   - Estimated delivery time calculation
   - Route optimization for delivery partners

5. **Multi-Language Support**

   - Support for regional languages (Hindi, Marathi, Gujarati, etc.)
   - Language selection in app settings
   - Localized content and UI

6. **Cloud Storage Integration**

   - Migrate image storage to AWS S3 or Google Cloud Storage
   - CDN integration for faster image delivery
   - Automatic image optimization and compression

7. **Inventory Management System**

   - Provider inventory tracking
   - Low stock alerts
   - Automatic item unavailability when out of stock

8. **Advanced Rating System**
   - Detailed rating categories (taste, packaging, delivery time, value for money)
   - Photo reviews
   - Provider response to reviews

#### 9.3.3 Long-Term Enhancements (1-2 Years)

1. **Artificial Intelligence and Machine Learning**

   - AI-powered recommendation engine
   - Demand forecasting for providers
   - Price optimization suggestions
   - Fraud detection and prevention
   - Chatbot for customer support

2. **Advanced Delivery Management**

   - Multi-order batch delivery optimization
   - Dynamic delivery partner assignment based on location and availability
   - Delivery partner performance analytics
   - Automated route planning

3. **Business Intelligence Platform**

   - Comprehensive analytics dashboard for all stakeholders
   - Predictive analytics for business trends
   - Market insights and competitor analysis
   - Revenue forecasting

4. **Social Features**

   - Social media integration
   - Share orders and reviews
   - Follow favorite providers
   - Community features and food groups

5. **Enterprise Features**

   - Corporate meal plans
   - Bulk ordering for events
   - Custom pricing for corporate clients
   - Invoice generation and tax management

6. **Advanced Security Features**

   - Two-factor authentication (2FA)
   - Biometric authentication (fingerprint, face recognition)
   - Enhanced encryption for sensitive data
   - Comprehensive audit logging
   - API rate limiting and DDoS protection

7. **Microservices Architecture**

   - Migrate to microservices for better scalability
   - Service-oriented architecture
   - Containerization with Docker
   - Kubernetes orchestration

8. **Mobile Web Application**

   - Progressive Web App (PWA) for web browsers
   - Responsive web interface for customers
   - Cross-platform compatibility

9. **Integration with Third-Party Services**

   - Google Maps integration for better location services
   - SMS gateway for OTP and notifications
   - Email marketing integration
   - Social media marketing tools

10. **Advanced Features**
    - Voice ordering (voice assistant integration)
    - AR/VR menu viewing
    - Nutritional information and calorie tracking
    - Dietary preference filters (vegetarian, vegan, gluten-free, etc.)
    - Allergy warnings and dietary restrictions

#### 9.3.4 Scalability Improvements

1. **Database Optimization**

   - Database sharding for horizontal scaling
   - Read replicas for improved read performance
   - Caching layer (Redis) for frequently accessed data
   - Database indexing optimization

2. **Infrastructure Scaling**

   - Cloud deployment (AWS, Azure, or GCP)
   - Auto-scaling based on load
   - Load balancing across multiple servers
   - CDN for static content delivery

3. **Performance Optimization**
   - API response caching
   - Database query optimization
   - Image lazy loading
   - Pagination for large datasets

#### 9.3.5 Market Expansion

1. **Geographic Expansion**

   - Multi-city support
   - Regional customization
   - Local payment methods
   - Regional language support

2. **Service Expansion**
   - Grocery delivery integration
   - Meal kit delivery
   - Catering services
   - Cooking classes and workshops

### 9.4 Final Remarks

The PlateMate project has successfully delivered a comprehensive food delivery platform that addresses the specific needs of home-based food providers and customers seeking authentic home-cooked meals. The system demonstrates:

- **Technical Excellence**: Modern technology stack, clean architecture, and best practices
- **User-Centric Design**: Intuitive interfaces and seamless user experience
- **Security and Reliability**: Robust security measures and comprehensive testing
- **Scalability Potential**: Architecture designed for future growth and expansion

While the current implementation has some limitations, the system provides a solid foundation for future enhancements. The planned features and improvements will further strengthen the platform's position in the market and enhance user satisfaction.

The project has been a valuable learning experience, demonstrating the application of software engineering principles, modern development practices, and the importance of user-centered design. PlateMate is ready for deployment and has the potential to make a significant impact in the home-made food delivery market.

---

## 10. References

This section lists all the books, websites, tools, documentation, and resources that were referenced, used, or consulted during the development of the PlateMate project.

### 10.1 Books

1. **"Spring Boot in Action"** by Craig Walls

   - Publisher: Manning Publications
   - Used for: Spring Boot framework understanding and best practices

2. **"Pro Spring Security"** by Iuliana Cosmina

   - Publisher: Apress
   - Used for: Spring Security implementation and JWT authentication

3. **"Android Programming: The Big Nerd Ranch Guide"** by Bill Phillips, Chris Stewart, and Kristin Marsicano

   - Publisher: Big Nerd Ranch Guides
   - Used for: Android application development fundamentals

4. **"Effective Java"** by Joshua Bloch

   - Publisher: Addison-Wesley Professional
   - Used for: Java best practices and coding standards

5. **"Clean Code: A Handbook of Agile Software Craftsmanship"** by Robert C. Martin

   - Publisher: Prentice Hall
   - Used for: Code quality and maintainability principles

6. **"Database Design for Mere Mortals"** by Michael J. Hernandez
   - Publisher: Addison-Wesley Professional
   - Used for: Database schema design and normalization

### 10.2 Websites and Online Documentation

#### 10.2.1 Framework Documentation

1. **Spring Boot Official Documentation**

   - URL: https://spring.io/projects/spring-boot
   - Used for: Spring Boot framework reference, configuration, and best practices

2. **Spring Security Documentation**

   - URL: https://spring.io/projects/spring-security
   - Used for: Security implementation, JWT authentication, and authorization

3. **Spring Data JPA Documentation**

   - URL: https://spring.io/projects/spring-data-jpa
   - Used for: JPA repository implementation and database operations

4. **Android Developer Documentation**

   - URL: https://developer.android.com
   - Used for: Android SDK, API references, and development guidelines

5. **Material Design Guidelines**
   - URL: https://material.io/design
   - Used for: UI/UX design principles and component guidelines

#### 10.2.2 Technology Documentation

6. **PostgreSQL Documentation**

   - URL: https://www.postgresql.org/docs/
   - Used for: Database features, SQL syntax, and optimization

7. **Java Documentation (Oracle)**

   - URL: https://docs.oracle.com/javase/
   - Used for: Java language reference and API documentation

8. **JWT.io - JSON Web Tokens**

   - URL: https://jwt.io
   - Used for: JWT token structure, encoding, and debugging

9. **Razorpay Developer Documentation**

   - URL: https://razorpay.com/docs/
   - Used for: Payment gateway integration, API reference, and webhook handling

10. **Retrofit Documentation**

    - URL: https://square.github.io/retrofit/
    - Used for: HTTP client implementation for Android

11. **Glide Image Loading Library**
    - URL: https://bumptech.github.io/glide/
    - Used for: Image loading and caching in Android application

#### 10.2.3 Tutorials and Learning Resources

12. **Baeldung - Spring Tutorials**

    - URL: https://www.baeldung.com/spring-tutorial
    - Used for: Spring Boot tutorials and examples

13. **Android Developers Blog**

    - URL: https://android-developers.googleblog.com
    - Used for: Latest Android features and best practices

14. **Stack Overflow**

    - URL: https://stackoverflow.com
    - Used for: Problem-solving and community support

15. **GitHub - Spring Boot Examples**

    - URL: https://github.com/spring-projects/spring-boot
    - Used for: Reference implementations and code examples

16. **Medium - Android Development Articles**
    - URL: https://medium.com/tag/android-development
    - Used for: Modern Android development practices and patterns

### 10.3 Tools and Software

#### 10.3.1 Development Tools

1. **Spring Tool Suite 4 (STS4)**

   - Type: Integrated Development Environment (IDE)
   - URL: https://spring.io/tools
   - Purpose: Spring Boot application development
   - Version: Latest

2. **Android Studio**

   - Type: Integrated Development Environment (IDE)
   - URL: https://developer.android.com/studio
   - Purpose: Android application development
   - Version: Latest (Hedgehog/Iguana)

3. **IntelliJ IDEA**

   - Type: Integrated Development Environment (IDE)
   - URL: https://www.jetbrains.com/idea/
   - Purpose: Alternative IDE for Java/Spring development
   - Version: Community/Ultimate Edition

4. **Visual Studio Code**

   - Type: Code Editor
   - URL: https://code.visualstudio.com
   - Purpose: Code editing and documentation

5. **Postman**

   - Type: API Testing Tool
   - URL: https://www.postman.com
   - Purpose: REST API testing and documentation
   - Version: Latest

6. **pgAdmin 4**

   - Type: Database Administration Tool
   - URL: https://www.pgadmin.org
   - Purpose: PostgreSQL database management
   - Version: Latest

7. **DBeaver**
   - Type: Universal Database Tool
   - URL: https://dbeaver.io
   - Purpose: Database management and SQL queries

#### 10.3.2 Build and Version Control Tools

8. **Apache Maven**

   - Type: Build Automation Tool
   - URL: https://maven.apache.org
   - Purpose: Java project build and dependency management
   - Version: 3.6.3+

9. **Gradle**

   - Type: Build Automation Tool
   - URL: https://gradle.org
   - Purpose: Android project build system
   - Version: 8.0+

10. **Git**

    - Type: Version Control System
    - URL: https://git-scm.com
    - Purpose: Source code version control
    - Version: 2.30+

11. **GitHub**
    - Type: Version Control Hosting
    - URL: https://github.com
    - Purpose: Code repository hosting and collaboration

#### 10.3.3 Testing Tools

12. **JUnit**

    - Type: Unit Testing Framework
    - URL: https://junit.org
    - Purpose: Java unit testing
    - Version: 5.x

13. **Mockito**

    - Type: Mocking Framework
    - URL: https://site.mockito.org
    - Purpose: Mock objects for testing

14. **Android Testing Support Library**

    - Type: Testing Framework
    - URL: https://developer.android.com/training/testing
    - Purpose: Android application testing

15. **Espresso**
    - Type: UI Testing Framework
    - URL: https://developer.android.com/training/testing/espresso
    - Purpose: Android UI automation testing

#### 10.3.4 Design and Documentation Tools

16. **Figma**

    - Type: UI/UX Design Tool
    - URL: https://www.figma.com
    - Purpose: UI mockups and design (if used)

17. **Draw.io / diagrams.net**

    - Type: Diagramming Tool
    - URL: https://app.diagrams.net
    - Purpose: System architecture and flow diagrams

18. **Markdown Editors**
    - Type: Documentation Tools
    - Tools: Typora, MarkdownPad, VS Code Markdown extensions
    - Purpose: Documentation writing

### 10.4 Libraries and Dependencies

#### 10.4.1 Backend Dependencies

1. **Spring Boot Starter Web** (3.5.6)

   - Purpose: REST API development
   - URL: https://spring.io/projects/spring-boot

2. **Spring Boot Starter Data JPA** (3.5.6)

   - Purpose: Database ORM and repository pattern
   - URL: https://spring.io/projects/spring-data-jpa

3. **Spring Boot Starter Security** (3.5.6)

   - Purpose: Authentication and authorization
   - URL: https://spring.io/projects/spring-security

4. **PostgreSQL JDBC Driver**

   - Purpose: PostgreSQL database connectivity
   - URL: https://jdbc.postgresql.org

5. **JJWT (Java JWT)** (0.11.5)

   - Purpose: JWT token generation and validation
   - URL: https://github.com/jwtk/jjwt

6. **Spring Boot Starter Mail**

   - Purpose: Email service integration
   - URL: https://spring.io/guides/gs/sending-email

7. **Spring Boot Starter Validation**
   - Purpose: Input validation
   - URL: https://spring.io/guides/gs/validating-form-input

#### 10.4.2 Android Dependencies

8. **Retrofit** (3.0.0)

   - Purpose: HTTP client for API calls
   - URL: https://square.github.io/retrofit

9. **Gson Converter** (3.0.0)

   - Purpose: JSON serialization/deserialization
   - URL: https://github.com/google/gson

10. **Glide** (4.16.0)

    - Purpose: Image loading and caching
    - URL: https://bumptech.github.io/glide

11. **Razorpay Checkout SDK** (1.6.33)

    - Purpose: Payment gateway integration
    - URL: https://razorpay.com/docs/payments/payment-gateway/android-integration

12. **AndroidX Libraries**

    - AppCompat, Material Design, RecyclerView, CardView, ConstraintLayout
    - Purpose: Modern Android UI components
    - URL: https://developer.android.com/jetpack/androidx

13. **SwipeRefreshLayout** (1.1.0)
    - Purpose: Pull-to-refresh functionality
    - URL: https://developer.android.com/reference/androidx/swiperefreshlayout

### 10.5 Third-Party Services

1. **Razorpay Payment Gateway**

   - Type: Payment Processing Service
   - URL: https://razorpay.com
   - Purpose: Payment processing and transaction management
   - Documentation: https://razorpay.com/docs

2. **Gmail SMTP**

   - Type: Email Service
   - URL: https://support.google.com/mail
   - Purpose: Email notifications and OTP delivery

3. **PostgreSQL Database**
   - Type: Database Management System
   - URL: https://www.postgresql.org
   - Purpose: Data storage and management

### 10.6 Standards and Specifications

1. **REST API Design Guidelines**

   - RESTful API best practices and conventions
   - HTTP methods, status codes, and resource naming

2. **JWT (JSON Web Token) Specification**

   - RFC 7519
   - URL: https://tools.ietf.org/html/rfc7519
   - Purpose: Token-based authentication standard

3. **OAuth 2.0 Specification**

   - Reference for authentication patterns
   - URL: https://oauth.net/2/

4. **Material Design Guidelines**

   - Google's design system
   - URL: https://material.io/design
   - Purpose: UI/UX design standards

5. **Android App Architecture Guidelines**
   - Google's recommended architecture patterns
   - URL: https://developer.android.com/jetpack/guide

### 10.7 Community Resources

1. **Stack Overflow**

   - URL: https://stackoverflow.com
   - Purpose: Problem-solving and community Q&A

2. **GitHub**

   - URL: https://github.com
   - Purpose: Open-source code examples and repositories

3. **Reddit Communities**

   - r/java, r/androiddev, r/SpringBoot
   - Purpose: Community discussions and support

4. **Discord/Slack Communities**
   - Spring Boot Community
   - Android Developers Community
   - Purpose: Real-time community support

### 10.8 Additional Resources

1. **YouTube Tutorials**

   - Spring Boot tutorials
   - Android development courses
   - REST API development guides

2. **Online Courses**

   - Udemy, Coursera, Pluralsight
   - Spring Boot and Android development courses

3. **Blog Posts and Articles**

   - Technical blogs on Spring Boot
   - Android development best practices
   - Security implementation guides

4. **Code Examples**
   - GitHub repositories with similar projects
   - Stack Overflow code snippets
   - Official documentation examples

### 10.9 Documentation Standards

1. **Markdown Syntax**

   - URL: https://www.markdownguide.org
   - Purpose: Documentation formatting

2. **API Documentation Standards**

   - OpenAPI/Swagger specifications
   - REST API documentation best practices

3. **Code Documentation**
   - JavaDoc standards
   - Code commenting best practices

---

## Document Information

**Project Name**: PlateMate - Home Made Food Delivery System  
**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Document Status**: Complete  
**Total Sections**: 10  
**Total Pages**: [Approximate page count]

---

**End of Documentation**
