"use server";

import { db } from "../_lib/prisma";

import { PaymentType, RateType } from "@prisma/client";

interface BankInput {
  name: string;
  initialBalance: number;
  initialBalanceDate?: Date;
  isActive: boolean;
  formsOfReceiving: {
    method: PaymentType;
    receiveTimeInDays: number;
    taxRate: number;
    typeOfRate: RateType | null | undefined;
  }[];
  formsOfPayment: {
    method: PaymentType;
    taxRate: number;
    typeOfRate: RateType | null | undefined;
  }[];
}

export async function createBank(data: BankInput) {
  try {
    const {
      name,
      initialBalance,
      initialBalanceDate,
      isActive,
      formsOfReceiving,
      formsOfPayment,
    } = data;

    // Nome sempre em UPPERCASE
    const upperCaseName = name.toUpperCase();

    // Buscar conta contábil pai
    console.log("🔹 Buscando conta contábil pai (1.1.1)...");
    const parentAccount = await db.chartOfAccounts.findUnique({
      where: { code: "1.1.1" },
    });

    if (!parentAccount) {
      throw new Error("Conta contábil pai não encontrada.");
    }

    // Gerar código automático para a conta contábil
    const accountCode = `${parentAccount.code}.${
      (await db.chartOfAccounts.count({
        where: { parentCode: parentAccount.code },
      })) + 1
    }`;

    console.log("✅ Gerado accountCode:", accountCode);

    // Criar conta contábil
    console.log("🔹 Criando conta contábil...");
    const account = await db.chartOfAccounts.create({
      data: {
        code: accountCode,
        name: upperCaseName,
        parentCode: "1.1.1",
        isAnalytical: true,
        type: "ASSET",
        balanceType: "DEBIT",
      },
    });
    console.log("✅ Conta contábil criada:", account);

    // Verificando Payload antes de salvar no banco
    console.log("🔹 Dados finais para criação do banco:", {
      name: upperCaseName,
      accountCode,
      initialBalance,
      initialBalanceDate,
      isActive,
      formsOfReceiving,
      formsOfPayment,
    });

    // Criar banco vinculado à conta contábil criada
    const bank = await db.bank.create({
      data: {
        name: upperCaseName,
        accountCode: account.code,
        initialBalance,
        initialBalanceDate: initialBalanceDate
          ? new Date(initialBalanceDate)
          : new Date(),
        isActive,
        formsOfReceiving: {
          create: formsOfReceiving.map(
            (method: {
              method: PaymentType;
              receiveTimeInDays: number;
              taxRate: number;
              typeOfRate: RateType | null | undefined;
            }) => ({
              method: method.method,
              receiveTimeInDays: method.receiveTimeInDays,
              taxRate: method.taxRate,
              typeOfRate: method.typeOfRate,
            }),
          ),
        },
        formsOfPayment: {
          create: formsOfPayment.map(
            (method: {
              method: PaymentType;
              taxRate: number;
              typeOfRate: RateType | null | undefined;
            }) => ({
              method: method.method,
              taxRate: method.taxRate,
              typeOfRate: method.typeOfRate,
            }),
          ),
        },
      },
    });

    console.log("✅ Banco criado com sucesso:", bank);

    return { success: "Banco criado com sucesso!", data: bank };
  } catch (error) {
    console.error("❌ Erro ao criar banco:", error);
    return { error: "Erro interno ao criar o banco." };
  }
}
