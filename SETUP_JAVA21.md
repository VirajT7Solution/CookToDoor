# Java 21 Installation Guide for PlateMate Backend

## Current Status
- ❌ Java 21 is **NOT** installed on your system
- ✅ Java 11 is installed at: `C:\Program Files\Java\jdk-11`
- ⚠️ Project requires Java 21 to compile and run

## Step 1: Install Java 21 JDK

### Option A: Download from Adoptium (Recommended - Free)
1. Visit: https://adoptium.net/temurin/releases/?version=21
2. Select:
   - **Version**: 21 (LTS)
   - **Operating System**: Windows
   - **Architecture**: x64
   - **Package Type**: JDK
3. Download the `.msi` installer
4. Run the installer and follow the setup wizard
5. **Important**: Check "Set JAVA_HOME variable" during installation

### Option B: Download from Oracle
1. Visit: https://www.oracle.com/java/technologies/downloads/#java21
2. Accept license agreement
3. Download Windows x64 Installer
4. Run installer and follow setup

### Option C: Use Chocolatey (if installed)
```powershell
choco install temurin21jdk
```

## Step 2: Verify Java 21 Installation

After installation, verify in Command Prompt or PowerShell:
```powershell
java -version
```

You should see output like:
```
openjdk version "21.0.x" ...
```

## Step 3: Set JAVA_HOME Environment Variable

### If not set during installation:

1. **Find Java 21 installation path** (usually):
   - `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot`
   - `C:\Program Files\Java\jdk-21`

2. **Set JAVA_HOME**:
   - Right-click "This PC" → Properties
   - Advanced System Settings → Environment Variables
   - Under "System variables", click "New"
   - Variable name: `JAVA_HOME`
   - Variable value: `C:\Program Files\Eclipse Adoptium\jdk-21.x.x-hotspot` (your actual path)
   - Click OK

3. **Update PATH**:
   - Edit "Path" variable in System variables
   - Add: `%JAVA_HOME%\bin`
   - Click OK on all dialogs

4. **Restart** Command Prompt/PowerShell/STS4 for changes to take effect

## Step 4: Verify in STS4

1. Open Spring Tool Suite 4
2. Go to: **Window → Preferences → Java → Installed JREs**
3. Click **Add...**
4. Select **Standard VM** → Next
5. Click **Directory...** and browse to Java 21 installation folder
6. Click **Finish**
7. Check the box next to Java 21 to set it as default
8. Click **Apply and Close**

## Step 5: Configure Project to Use Java 21

1. Right-click project → **Properties**
2. **Java Build Path** → **Libraries** tab
3. Remove old JRE System Library if it's Java 11
4. Click **Add Library...** → **JRE System Library** → Next
5. Select **Workspace default JRE** (should be Java 21) → Finish
6. **Java Compiler** → Set compiler compliance level to **21**
7. Click **Apply and Close**

## Next Steps

After Java 21 is installed and configured:
1. Right-click project → **Maven → Update Project**
2. Right-click project → **Maven → Clean**
3. Right-click project → **Maven → Install**
4. Run the application: Right-click `PlateMateApplication.java` → **Run As → Spring Boot App**

## Troubleshooting

### If Java 21 still not recognized:
- Restart STS4 completely
- Verify JAVA_HOME points to Java 21: `echo %JAVA_HOME%`
- Check PATH includes Java 21: `echo %PATH%`

### If build still fails:
- Ensure project properties → Java Compiler → Compliance level is 21
- Clean project: **Maven → Clean**
- Rebuild: **Maven → Install**

