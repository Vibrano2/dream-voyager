import { useLocation, Navigate } from 'react-router-dom';
import BookingForm from '../../../components/booking/BookingForm';

const Book = () => {
    const location = useLocation();
    const state = location.state as {
        packageId?: string;
        packageTitle?: string;
        packagePrice?: number;
        packageImage?: string;
        packageLocation?: string;
        bookingType?: 'package' | 'flight' | 'visa' | 'study-visa';
    } | null;

    if (!state) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="pt-20">
            <BookingForm
                packageId={state.packageId}
                packageTitle={state.packageTitle || 'Booking'}
                packagePrice={state.packagePrice || 0}
                packageImage={state.packageImage}
                packageLocation={state.packageLocation}
                bookingType={state.bookingType}
            />
        </div>
    );
};

export default Book;
