"use client";

import React, { useState } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaPhone, FaUser, FaCalendarAlt, FaCheck, FaCut, FaShower } from 'react-icons/fa';
import styles from './page.module.css';

export default function BarbeariaTotem() {
  // Estados do formulário inicial
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Novos estados para serviços e barbeiros
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Dados simulados
  const services = [
    { id: 1, name: 'Corte de Cabelo', icon: <FaCut />, price: 50, duration: 30 },
    { id: 2, name: 'Barba', icon: <FaShower />, price: 40, duration: 25 },
    { id: 3, name: 'Combo Corte + Barba', icon: <><FaCut /><FaShower /></>, price: 80, duration: 50 }
  ];

  const barbers = [
    { id: '1', name: 'João Silva', specialty: 'Cortes modernos' },
    { id: '2', name: 'Carlos Andrade', specialty: 'Barba tradicional' },
    { id: '3', name: 'Marcos Oliveira', specialty: 'Estilo clássico' },
    { id: '4', name: 'Qualquer barbeiro disponível', specialty: '' }
  ];


  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length >= 10) {
      setStep(2);
    } else {
      alert('Por favor, insira um número de telefone válido com DDD');
    }
  };

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (name.trim().length >= 3) {
      setStep(3);
    } else {
      alert('Por favor, insira seu nome completo');
    }
  };


  const handleBirthDateSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const parsedDate: Date = parseISO(birthDate);
    if (isValid(parsedDate)) {
      setStep(4);
    } else {
      alert('Por favor, insira uma data de nascimento válida');
    }
  };


  const handleFinalSubmit = async (e: React.FormEvent<HTMLFormElement> ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      setStep(5); // Avança para seleção de serviço
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  interface Service {
    id: number;
    name: string;
    icon: React.JSX.Element;
    price: number;
    duration: number;
  }

  const handleServiceSelect = (service: Service): void => {
    setSelectedService(service);
    setStep(6); // Avança para seleção de barbeiro
  };

  const handleBarberSelect = (e: React.ChangeEvent<HTMLSelectElement> ): void => {
    setSelectedBarber(e.target.value);
  };

  const handleBarberSubmit = (e: React.FormEvent<HTMLFormElement> ): void => {
    e.preventDefault();
    if (selectedBarber) {
      setIsConfirmed(true);
    } else {
      alert('Por favor, selecione um barbeiro');
    }
  };

  const resetForm = () => {
    setStep(1);
    setPhone('');
    setName('');
    setBirthDate('');
    setSelectedService(null);
    setSelectedBarber('');
    setIsConfirmed(false);
  };

  interface FormatPhone {
    (value: string): string;
  }

  const formatPhone: FormatPhone = (value) => {
    const numericValue = value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (numericValue.length > 0) {
      formattedValue = `(${numericValue.substring(0, 2)}`;
    }
    if (numericValue.length > 2) {
      formattedValue += `) ${numericValue.substring(2, 7)}`;
    }
    if (numericValue.length > 7) {
      formattedValue += `-${numericValue.substring(7, 11)}`;
    }
    
    return formattedValue;
  };

  return (
    <div className={styles.container}>
      <div className={styles.totemWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>Barbearia Premium</h1>
        </div>
        
        <div className={styles.content}>
          {/* Fluxo de cadastro inicial (passos 1-4) */}
          {step <= 4 && (
            <>
              <div className={styles.progressSteps}>
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className={styles.stepContainer}>
                    <div
                      className={`${styles.stepCircle} ${
                        step === stepNumber
                          ? styles.activeStep
                          : step > stepNumber
                          ? styles.completedStep
                          : styles.inactiveStep
                      }`}
                    >
                      {stepNumber === 1 ? <FaPhone /> : 
                       stepNumber === 2 ? <FaUser /> : 
                       stepNumber === 3 ? <FaCalendarAlt /> : 
                       <FaCheck />}
                    </div>
                    <span className={styles.stepLabel}>
                      {stepNumber === 1 ? 'Telefone' : 
                       stepNumber === 2 ? 'Nome' : 
                       stepNumber === 3 ? 'Nascimento' : 
                       'Confirmação'}
                    </span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <form onSubmit={handlePhoneSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Digite seu número de celular
                    </label>
                    <input
                      type="tel"
                      className={styles.input}
                      placeholder="(XX) XXXXX-XXXX"
                      value={formatPhone(phone)}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={`${styles.button} ${styles.primaryButton}`}
                  >
                    Próximo
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleNameSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Qual é o seu nome completo?
                    </label>
                    <input
                      type="text"
                      className={styles.input}
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`${styles.button} ${styles.secondaryButton}`}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className={`${styles.button} ${styles.primaryButton}`}
                    >
                      Próximo
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleBirthDateSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Data de nascimento
                    </label>
                    <input
  type="date"
  className={`${styles.input} ${styles.dateInput}`} // Adicione a classe dateInput
  value={birthDate}
  onChange={(e) => setBirthDate(e.target.value)}
  required
/>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`${styles.button} ${styles.secondaryButton}`}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className={`${styles.button} ${styles.primaryButton}`}
                    >
                      Próximo
                    </button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <form onSubmit={handleFinalSubmit} className={styles.form}>
                  <div className={styles.confirmationContainer}>
                    <h2 className={styles.confirmationTitle}>
                      Confirme seus dados
                    </h2>
                    <div className={styles.confirmationData}>
                      <div className={styles.dataField}>
                        <p className={styles.dataLabel}>Telefone:</p>
                        <p className={styles.dataValue}>{formatPhone(phone)}</p>
                      </div>
                      <div className={styles.dataField}>
                        <p className={styles.dataLabel}>Nome:</p>
                        <p className={styles.dataValue}>{name}</p>
                      </div>
                      <div className={styles.dataField}>
                        <p className={styles.dataLabel}>Data de Nascimento:</p>
                        <p className={styles.dataValue}>
                          {birthDate && isValid(parseISO(birthDate))
                            ? format(parseISO(birthDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            : 'Data inválida'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.buttonGroup}>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className={`${styles.button} ${styles.secondaryButton}`}
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className={`${styles.button} ${styles.successButton}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Confirmar'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Seleção de Serviço (passo 5) */}
          {step === 5 && (
            <div className={styles.serviceSelection}>
              <h2 className={styles.sectionTitle}>Escolha seu serviço</h2>
              <p className={styles.sectionSubtitle}>Selecione o serviço desejado</p>
              
              <div className={styles.serviceGrid}>
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={styles.serviceCard}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className={styles.serviceIcon}>
                      {service.icon}
                    </div>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.servicePrice}>R$ {service.price.toFixed(2)}</p>
                    <p className={styles.serviceDuration}>{service.duration} minutos</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seleção de Barbeiro (passo 6) */}
          {step === 6 && !isConfirmed && (
            <form onSubmit={handleBarberSubmit} className={styles.form}>
              <h2 className={styles.sectionTitle}>Escolha seu barbeiro</h2>
              <p className={styles.sectionSubtitle}>Selecione um profissional</p>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Barbeiro:</label>
                <select
                  className={styles.selectInput}
                  value={selectedBarber}
                  onChange={handleBarberSelect}
                  required
                >
                  <option value="">Selecione um barbeiro</option>
                  {barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.name} {barber.specialty && `- ${barber.specialty}`}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.selectedService}>
                <h3 className={styles.selectedServiceTitle}>Serviço selecionado:</h3>
                <div className={styles.serviceInfo}>
                  <div className={styles.serviceIconSmall}>
                    {selectedService && selectedService.icon}
                  </div>
                  <div>
                    <p className={styles.serviceInfoName}>{selectedService?.name || 'Serviço não selecionado'}</p>
                    <p className={styles.serviceInfoDetails}>
                      {selectedService ? `R$ ${selectedService.price.toFixed(2)} • ${selectedService.duration} min` : 'Serviço não selecionado'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className={`${styles.button} ${styles.secondaryButton}`}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          )}

          {/* Confirmação Final */}
          {isConfirmed && (
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <FaCheck />
              </div>
              <h2 className={styles.successTitle}>Agendamento confirmado!</h2>
              
              <div className={styles.confirmationDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Cliente:</span>
                  <span className={styles.detailValue}>{name}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Serviço:</span>
                  <span className={styles.detailValue}>{selectedService?.name || 'Serviço não selecionado'}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Barbeiro:</span>
                  <span className={styles.detailValue}>
                    {barbers.find(b => b.id === selectedBarber)?.name}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Valor:</span>
                  <span className={styles.detailValue}>
                    R$ {selectedService ? selectedService.price.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
              
              <p className={styles.successMessage}>
                Você receberá uma confirmação por SMS no número {formatPhone(phone)}
              </p>
              
              <button
                onClick={resetForm}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                Novo Agendamento
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}