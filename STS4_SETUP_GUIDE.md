# Spring Tool Suite 4 (STS4) Setup Guide for PlateMate Backend

## Prerequisites Checklist
- [ ] Java 21 JDK installed (see SETUP_JAVA21.md)
- [ ] PostgreSQL database running on localhost:5432
- [ ] Database `platemate` created (or will be auto-created)
- [ ] Spring Tool Suite 4 installed

## Step 1: Import Project into STS4

1. Open Spring Tool Suite 4
2. Go to **File → Import**
3. Expand **Maven** folder
4. Select **Existing Maven Projects**
5. Click **Next**
6. Click **Browse...** next to "Root Directory"
7. Navigate to: `C:\Users\AASHISH\OneDrive\Desktop\viraj222\platemate-backend`
8. Click **Select Folder**
9. Ensure `pom.xml` is checked in the Projects list
10. Click **Finish**
11. Wait for Maven to import and download dependencies (check Progress view)

## Step 2: Configure Java 21 in STS4

1. Go to **Window → Preferences** (or **Eclipse → Preferences** on Mac)
2. Navigate to **Java → Installed JREs**
3. Check if Java 21 is listed:
   - ✅ If YES: Check the box to set it as default, then skip to Step 3
   - ❌ If NO: Continue with steps below

### Adding Java 21 to STS4:

4. Click **Add...** button
5. Select **Standard VM** → Click **Next**
6. Click **Directory...** button
7. Browse to Java 21 installation folder:
   - Usually: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot`
   - Or: `C:\Program Files\Java\jdk-21`
8. Click **OK**
9. JRE name should auto-populate as "jdk-21" or similar
10. Click **Finish**
11. Check the checkbox next to Java 21 to set it as default
12. Click **Apply and Close**

## Step 3: Configure Project Java Version

1. In Project Explorer, right-click **PlateMate** project
2. Select **Properties**
3. Go to **Java Build Path** → **Libraries** tab
4. Expand **Modulepath** or **Classpath**
5. Find **JRE System Library**
6. If it shows Java 11 or Java 8:
   - Select it → Click **Remove**
   - Click **Add Library...**
   - Select **JRE System Library** → **Next**
   - Select **Workspace default JRE** (should be Java 21) → **Finish**
7. Go to **Java Compiler** in left sidebar
8. Set **Compiler compliance level** to **21**
9. Ensure **Use compliance from execution environment** is unchecked
10. Click **Apply and Close**

## Step 4: Update Maven Project

1. Right-click **PlateMate** project
2. Select **Maven → Update Project...** (or press Alt+F5)
3. In the dialog:
   - ✅ Check **Force Update of Snapshots/Releases**
   - ✅ Check **Clean projects** (optional but recommended)
4. Click **OK**
5. Wait for Maven to download dependencies (check Console view)
6. Look for "BUILD SUCCESS" or completion message

## Step 5: Clean Project

1. Right-click **PlateMate** project
2. Select **Maven → Clean**
3. Watch Console view for output
4. Wait for "BUILD SUCCESS" message

## Step 6: Build/Compile Project

1. Right-click **PlateMate** project
2. Select **Maven → Install** (compiles and packages)
   - OR: **Maven → Compile** (just compiles)
3. Watch Console view for build progress
4. Wait for "BUILD SUCCESS" message
5. If "BUILD FAILURE":
   - Check console for error messages
   - Common issues:
     - Java version mismatch → Go back to Step 3
     - Network issues → Check internet connection
     - Missing dependencies → Try Step 4 again

## Step 7: Verify Build Output

1. In Project Explorer, expand **PlateMate** project
2. Expand **target** folder
3. Expand **classes** folder
4. Navigate to **com/platemate/**
5. Verify **PlateMateApplication.class** file exists
6. If missing: Build failed, check console errors

## Step 8: Configure Database Connection

1. Open `src/main/resources/application.properties`
2. Verify database settings:
   ```
   spring.datasource.url=jdbc:postgresql://localhost:5432/platemate
   spring.datasource.username=postgres
   spring.datasource.password=aa@123
   ```
3. Ensure PostgreSQL is running
4. Ensure database `platemate` exists (or will be auto-created)

## Step 9: Run the Application

### Method 1: Run as Spring Boot App (Recommended)
1. Navigate to: `src/main/java/com/platemate/PlateMateApplication.java`
2. Right-click the file
3. Select **Run As → Spring Boot App**
4. Watch Console for startup messages
5. Look for: `Started PlateMateApplication in X.XXX seconds`
6. Application will be available at: `http://localhost:8080`

### Method 2: Run via Maven Goal
1. Right-click **PlateMate** project
2. Select **Run As → Maven Build...**
3. In "Goals" field, enter: `spring-boot:run`
4. Click **Run**
5. This compiles and runs in one step

### Method 3: Use Spring Boot Dashboard
1. Open **Spring Boot Dashboard** view:
   - **Window → Show View → Other...**
   - Expand **Spring Boot**
   - Select **Spring Boot Dashboard**
   - Click **Open**
2. Find **PlateMate** in the dashboard
3. Right-click → **Run** (or click play button)

## Step 10: Verify Application Started

Check Console output for:
- ✅ `Started PlateMateApplication`
- ✅ `Tomcat started on port(s): 8080`
- ✅ No error messages about database connection

## Troubleshooting

### Issue: "Could not find or load main class"
**Solution:**
1. Ensure project is built: **Maven → Install**
2. Verify `.class` files exist in `target/classes`
3. Refresh project: Right-click → **Refresh** (F5)
4. Rebuild: **Maven → Clean** then **Maven → Install**

### Issue: "release version 21 not supported"
**Solution:**
1. Verify Java 21 is installed: `java -version` in command prompt
2. Configure Java 21 in STS4 (Step 2)
3. Set project to use Java 21 (Step 3)
4. Rebuild project

### Issue: Database connection failed
**Solution:**
1. Ensure PostgreSQL service is running
2. Verify database credentials in `application.properties`
3. Check if database `platemate` exists
4. Test connection: `psql -U postgres -d platemate`

### Issue: Maven menu not visible
**Solution:**
1. Ensure project is imported as Maven project
2. Re-import: **File → Import → Maven → Existing Maven Projects**
3. Check project shows Maven icon in Project Explorer

### Issue: Dependencies not downloading
**Solution:**
1. Check internet connection
2. **Window → Preferences → Maven**
3. Ensure "Download repository index updates on startup" is enabled
4. Try: **Maven → Update Project** with "Force Update" checked

## Quick Reference Commands

- **Update Maven Project**: Right-click project → **Maven → Update Project** (Alt+F5)
- **Clean**: Right-click project → **Maven → Clean**
- **Build**: Right-click project → **Maven → Install**
- **Run**: Right-click `PlateMateApplication.java` → **Run As → Spring Boot App**
- **Refresh**: Right-click project → **Refresh** (F5)

## Project Structure
```
platemate-backend/
├── src/
│   ├── main/
│   │   ├── java/com/platemate/
│   │   │   └── PlateMateApplication.java  ← Main class
│   │   └── resources/
│   │       └── application.properties     ← Database config
│   └── test/
├── target/                                 ← Build output
│   └── classes/                            ← Compiled .class files
├── pom.xml                                 ← Maven configuration
└── mvnw.cmd                                ← Maven wrapper
```

## Success Indicators

✅ Project shows Maven icon in Project Explorer  
✅ Java 21 configured in project properties  
✅ `target/classes/com/platemate/PlateMateApplication.class` exists  
✅ Console shows "BUILD SUCCESS"  
✅ Application starts without errors  
✅ Console shows "Started PlateMateApplication"  

