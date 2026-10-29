CREATE TABLE "product" (
	"id" varchar(128) PRIMARY KEY,
	"slug" varchar(256) NOT NULL UNIQUE,
	"sku" varchar(256) NOT NULL UNIQUE,
	"name" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"currency" char(3) DEFAULT 'BDT' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "price_non_negative" CHECK ("price" >= 0),
	CONSTRAINT "stock_non_negative" CHECK ("stock" >= 0)
);
