import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg" className="w-full">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
