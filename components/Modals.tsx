"use client";
import { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useForm, SubmitHandler } from 'react-hook-form';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; 
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto'; 
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} 
    >
      <div
        className="bg-background rounded-lg p-6 w-full max-w-md border border-foreground/20"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-foreground hover:text-primary focus:outline-none"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      // Simulate API call (replace with your actual authentication logic)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Login data:', data);
      onClose(); 
    } catch (error) {
      setError('root', { message: 'Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Нэвтрэх">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-foreground mb-1">
            И-мэйл
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'И-мэйл оруулна уу',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Зөв и-мэйл хаяг оруулна уу',
              },
            })}
            className={`w-full px-3 py-2 bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 ${
              errors.email ? 'focus:ring-red-500 border-red-500' : 'focus:ring-primary'
            }`}
            placeholder="И-мэйлээ оруулна уу"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-foreground mb-1">
            Нууц үг
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Нууц үг оруулна уу',
              minLength: { value: 6, message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' },
            })}
            className={`w-full px-3 py-2 bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 ${
              errors.password ? 'focus:ring-red-500 border-red-500' : 'focus:ring-primary'
            }`}
            placeholder="Нууц үгээ оруулна уу"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary transition ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
        </button>
      </form>
    </Modal>
  );
};

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    try {
      // Simulate API call (replace with your actual signup logic)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Signup data:', data);
      onClose(); 
    } catch (error) {
      setError('root', { message: 'Бүртгүүлэхэд алдаа гарлаа. Дахин оролдоно уу.' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Бүртгүүлэх">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-foreground mb-1">
            Нэр
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Нэр оруулна уу',
              minLength: { value: 2, message: 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой' },
            })}
            className={`w-full px-3 py-2 bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 ${
              errors.name ? 'focus:ring-red-500 border-red-500' : 'focus:ring-primary'
            }`}
            placeholder="Таны нэр"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-foreground mb-1">
            И-мэйл
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'И-мэйл оруулна уу',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Зөв и-мэйл хаяг оруулна уу',
              },
            })}
            className={`w-full px-3 py-2 bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 ${
              errors.email ? 'focus:ring-red-500 border-red-500' : 'focus:ring-primary'
            }`}
            placeholder="И-мэйлээ оруулна уу"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-foreground mb-1">
            Нууц үг
          </label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Нууц үг оруулна уу',
              minLength: { value: 6, message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' },
            })}
            className={`w-full px-3 py-2 bg-background border border-foreground/20 rounded-full text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 ${
              errors.password ? 'focus:ring-red-500 border-red-500' : 'focus:ring-primary'
            }`}
            placeholder="Нууц үгээ оруулна уу"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-secondary text-white px-4 py-2 rounded-full hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary transition ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Бүртгүүлж байна...' : 'Бүртгүүлэх'}
        </button>
      </form>
    </Modal>
  );
};