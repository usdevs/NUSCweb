-- CreateEnum
CREATE TYPE "public"."IGCategory" AS ENUM ('Sports', 'SocioCultural', 'Others', 'Guips');

-- CreateEnum
CREATE TYPE "public"."Semester" AS ENUM ('Semester1', 'Semester2');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "telegramId" TEXT,
    "telegramUserName" TEXT NOT NULL,
    "telegramDpUrl" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organisation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'A NUSC organisation',
    "isAdminOrg" BOOLEAN NOT NULL DEFAULT false,
    "inviteLink" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "public"."IGCategory" NOT NULL,
    "isInactive" BOOLEAN NOT NULL DEFAULT false,
    "isInvisible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserOnOrg" (
    "userId" INTEGER NOT NULL,
    "orgId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isIGHead" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserOnOrg_pkey" PRIMARY KEY ("userId","orgId")
);

-- CreateTable
CREATE TABLE "public"."Venue" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VenueAdminRole" (
    "id" SERIAL NOT NULL,
    "venueId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "VenueAdminRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "eventName" TEXT NOT NULL,
    "venueId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "userOrgId" INTEGER NOT NULL,
    "bookedForOrgId" INTEGER,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "bookedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoleAbility" (
    "id" SERIAL NOT NULL,
    "roleId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,

    CONSTRAINT "RoleAbility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrgRole" (
    "id" SERIAL NOT NULL,
    "orgId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "OrgRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Course" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "public"."Professor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseOffering" (
    "id" SERIAL NOT NULL,
    "courseCode" TEXT NOT NULL,
    "professorId" INTEGER NOT NULL,
    "semester" "public"."Semester" NOT NULL,
    "academicYear" INTEGER NOT NULL,

    CONSTRAINT "CourseOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" SERIAL NOT NULL,
    "matriculationNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "studentId" INTEGER NOT NULL,
    "courseOfferingId" INTEGER NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "public"."User"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_slug_key" ON "public"."Organisation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_name_key" ON "public"."Ability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RoleAbility_roleId_abilityId_key" ON "public"."RoleAbility"("roleId", "abilityId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgRole_orgId_roleId_key" ON "public"."OrgRole"("orgId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_name_key" ON "public"."Professor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CourseOffering_courseCode_professorId_semester_academicYear_key" ON "public"."CourseOffering"("courseCode", "professorId", "semester", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "Student_matriculationNo_key" ON "public"."Student"("matriculationNo");

-- AddForeignKey
ALTER TABLE "public"."UserOnOrg" ADD CONSTRAINT "UserOnOrg_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOnOrg" ADD CONSTRAINT "UserOnOrg_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VenueAdminRole" ADD CONSTRAINT "VenueAdminRole_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VenueAdminRole" ADD CONSTRAINT "VenueAdminRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "public"."Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_userId_userOrgId_fkey" FOREIGN KEY ("userId", "userOrgId") REFERENCES "public"."UserOnOrg"("userId", "orgId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_bookedForOrgId_fkey" FOREIGN KEY ("bookedForOrgId") REFERENCES "public"."Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoleAbility" ADD CONSTRAINT "RoleAbility_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoleAbility" ADD CONSTRAINT "RoleAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "public"."Ability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrgRole" ADD CONSTRAINT "OrgRole_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "public"."Organisation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrgRole" ADD CONSTRAINT "OrgRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "public"."Course"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CourseOffering" ADD CONSTRAINT "CourseOffering_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "public"."Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_courseOfferingId_fkey" FOREIGN KEY ("courseOfferingId") REFERENCES "public"."CourseOffering"("id") ON DELETE CASCADE ON UPDATE CASCADE;
