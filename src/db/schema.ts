import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index
} from "drizzle-orm/pg-core";

/* =========================
   AUTH TABLES (BetterAuth)
========================= */

export const user = pgTable("user", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  email: text("email").notNull().unique(),

  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),

    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => ({
    userIdx: index("session_user_idx").on(table.userId),
  })
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),

    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),

    idToken: text("id_token"),

    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

    scope: text("scope"),
    password: text("password"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    userIdx: index("account_user_idx").on(table.userId),
  })
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),
    value: text("value").notNull(),

    expiresAt: timestamp("expires_at").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  })
);

/* =========================
   CLASSES
========================= */

export const classes = pgTable("classes", {
  id: text("id").primaryKey(),

  name: text("name").notNull(),
  description: text("description"),

  teacherId: text("teacher_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  weekday: text("weekday").notNull(),
  time: text("time").notNull(),

  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   STUDENTS
========================= */

export const students = pgTable(
  "students",
  {
    id: text("id").primaryKey(),

    name: text("name").notNull(),

    parentPhone: text("parent_phone"),

    classId: text("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    classIdx: index("students_class_idx").on(table.classId),
  })
);

/* =========================
   STUDENT REPORTS
========================= */

export const studentReports = pgTable(
  "student_reports",
  {
    id: text("id").primaryKey(),

    studentId: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),

    teacherId: text("teacher_id")
      .notNull()
      .references(() => user.id),

    classId: text("class_id")
      .notNull()
      .references(() => classes.id),

    reportDate: timestamp("report_date").notNull(),

    comment: text("comment").notNull(),

    status: text("status")
      .default("pending")
      .notNull(), 
    // pending | approved | rejected

    reviewedBy: text("reviewed_by").references(() => user.id),
    reviewedAt: timestamp("reviewed_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    studentIdx: index("reports_student_idx").on(table.studentId),
    teacherIdx: index("reports_teacher_idx").on(table.teacherId),
    statusIdx: index("reports_status_idx").on(table.status),
  })
);

/* =========================
   SALARY
========================= */

export const salaries = pgTable(
  "salaries",
  {
    id: text("id").primaryKey(),

    teacherId: text("teacher_id")
      .notNull()
      .references(() => user.id),

    month: text("month").notNull(),

    totalReports: text("total_reports"),

    amount: text("amount").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    teacherIdx: index("salary_teacher_idx").on(table.teacherId),
  })
);

/* =========================
   RELATIONS
========================= */

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),

  classes: many(classes),
  reports: many(studentReports),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(user, {
    fields: [classes.teacherId],
    references: [user.id],
  }),

  students: many(students),
  reports: many(studentReports),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  class: one(classes, {
    fields: [students.classId],
    references: [classes.id],
  }),

  reports: many(studentReports),
}));

export const studentReportsRelations = relations(
  studentReports,
  ({ one }) => ({
    student: one(students, {
      fields: [studentReports.studentId],
      references: [students.id],
    }),

    teacher: one(user, {
      fields: [studentReports.teacherId],
      references: [user.id],
    }),

    class: one(classes, {
      fields: [studentReports.classId],
      references: [classes.id],
    }),
  })
);

/* =========================
   EXPORT SCHEMA
========================= */

export const schema = {
  user,
  session,
  account,
  verification,

  classes,
  students,
  studentReports,
  salaries,
};