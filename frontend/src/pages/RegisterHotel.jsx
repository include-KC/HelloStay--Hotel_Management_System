import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Hotel, ArrowRight, CheckCircle2, Search, Globe, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const COUNTRIES = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
  { code: 'NP', name: 'Nepal', currency: 'NPR' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'OM', name: 'Oman', currency: 'OMR' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'BH', name: 'Bahrain', currency: 'BHD' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'TR', name: 'Turkey', currency: 'TRY' },
  { code: 'RU', name: 'Russia', currency: 'RUB' },
  { code: 'PT', name: 'Portugal', currency: 'EUR' },
  { code: 'GR', name: 'Greece', currency: 'EUR' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'AT', name: 'Austria', currency: 'EUR' },
  { code: 'IE', name: 'Ireland', currency: 'EUR' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
  { code: 'FI', name: 'Finland', currency: 'EUR' },
  { code: 'PL', name: 'Poland', currency: 'PLN' },
  { code: 'CZ', name: 'Czech Republic', currency: 'CZK' },
  { code: 'HU', name: 'Hungary', currency: 'HUF' },
  { code: 'VN', name: 'Vietnam', currency: 'VND' },
  { code: 'MM', name: 'Myanmar', currency: 'MMK' },
];

const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
];

const FACILITIES_LIST = [
  "Free WiFi", "Swimming Pool", "In-house Restaurant", "Gym / Fitness Center",
  "Spa & Wellness", "Conference Room", "Free Parking", "Room Service",
  "Bar / Lounge", "Airport Shuttle", "Pet Friendly", "Business Center",
  "Laundry Service", "24/7 Front Desk", "Elevators", "Kids Play Area",
  "Banquet Hall", "EV Charging Station", "Valet Parking", "Wheelchair Accessible",
  "Game Zone / Arcade", "Pool House", "Casino", "Golf Course", "Tennis Court",
  "Private Beach Access", "Rooftop Terrace", "Library", "Gift Shop", "Concierge Service",
  "Currency Exchange", "Tour Desk", "Bicycle Rental", "Car Hire", "Nightclub / DJ",
  "Babysitting Service", "BBQ Facilities", "Vending Machines", "ATM / Cash Machine",
  "Ski Storage", "Water Park", "Hot Tub / Jacuzzi", "Sauna", "Steam Room", "Yoga Classes",
  "Tiffin Service", "Tea / Coffee", "Daily Housekeeping", "Wake-up Service",
];

export default function RegisterHotel() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    hotelName: '',
    totalRooms: '',
    country: '',
    currency: '',
    facilities: []
  });

  const toggleFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleCountryChange = (countryCode) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    setFormData(prev => ({
      ...prev,
      country: countryCode,
      currency: country ? country.currency : prev.currency
    }));
  };

  const handleSaveAndContinue = () => {
    localStorage.setItem('helloStay_hotelData', JSON.stringify({
      hotelName: formData.hotelName || 'My Awesome Hotel',
      totalRooms: formData.totalRooms || '50',
      country: formData.country,
      currency: formData.currency || 'INR',
      facilities: formData.facilities
    }));

    navigate('/dashboard');
  };

  const filteredFacilities = useMemo(() => {
    return FACILITIES_LIST.filter(facility =>
      facility.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedCountry = COUNTRIES.find(c => c.code === formData.country);
  const selectedCurrency = CURRENCY_OPTIONS.find(c => c.code === formData.currency);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="bg-indigo-600 p-8 text-white">
            <Hotel className="w-12 h-12 mb-4 text-indigo-200" />
            <h2 className="text-2xl font-bold">Setup Hotel Profile</h2>
            <p className="text-indigo-100 mt-2">Configure your property details. This will customize your dashboard.</p>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    value={formData.hotelName}
                    onChange={(e) => setFormData({ ...formData, hotelName: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                    placeholder="e.g. The Grand Plaza"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Number of Rooms</label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all"
                    placeholder="e.g. 150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-gray-400" />
                      Country
                    </div>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select country...</option>
                    {COUNTRIES.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      Currency
                    </div>
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select currency...</option>
                    {CURRENCY_OPTIONS.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} - {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedCountry && selectedCurrency && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">{selectedCurrency.symbol}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-800">
                      {selectedCountry.name} — {selectedCurrency.name}
                    </p>
                    <p className="text-xs text-indigo-500">
                      Room prices will be displayed in {selectedCurrency.code}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Available Facilities</label>
                    <p className="text-xs text-gray-500 mt-1">Select all the amenities your property offers.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 transition-all text-sm"
                      placeholder="Search facilities..."
                    />
                  </div>
                </div>

                {filteredFacilities.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
                    <p className="text-gray-500 text-sm">No facilities match your search.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto custom-scrollbar p-1">
                    {filteredFacilities.map((facility) => {
                      const isSelected = formData.facilities.includes(facility);
                      return (
                        <button
                          key={facility}
                          onClick={() => toggleFacility(facility)}
                          className={clsx(
                            "flex items-center p-3 rounded-xl border transition-all text-sm font-medium text-left",
                            isSelected
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                              : "bg-white border-gray-200 text-gray-600 hover:border-indigo-100 hover:bg-gray-50"
                          )}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 mr-2 border rounded-full flex-shrink-0" />
                          )}
                          <span className="truncate">{facility}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {formData.facilities.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-indigo-600">
                      {formData.facilities.length} facilities selected
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSaveAndContinue}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center"
                >
                  Save & Launch Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
