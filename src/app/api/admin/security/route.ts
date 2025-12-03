import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { currentPassword, newUsername, newPassword } = body;

        // For now, we hardcode the current credentials for verification
        // In production, these should be stored securely in environment variables or database
        const CURRENT_USERNAME = "artroad10";
        const CURRENT_PASSWORD = "S@ha1201200";

        // Verify current password
        if (currentPassword !== CURRENT_PASSWORD) {
            return new NextResponse("Current password is incorrect", { status: 401 });
        }

        // Validate that at least one new value is provided
        if (!newUsername && !newPassword) {
            return new NextResponse("Please provide a new username or password", { status: 400 });
        }

        // TODO: In a production environment, you should:
        // 1. Hash the newPassword using bcrypt before storing
        // 2. Store credentials in a database or update environment variables
        // 3. Implement proper session management

        // For demonstration, we'll acknowledge the change but note it's not persisted
        const updatedCredentials = {
            username: newUsername || CURRENT_USERNAME,
            // In production:  password: await bcrypt.hash(newPassword, 10)
            passwordChanged: !!newPassword,
        };

        console.log("⚠️ Security Warning: Credentials changed but not persisted.");
        console.log("New credentials would be:", updatedCredentials);
        console.log("To implement full functionality, update environment variables or use a database.");

        return NextResponse.json({
            success: true,
            message: "Credentials updated (demo mode - not persisted)",
        });

    } catch (error) {
        console.error("Error updating security:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
