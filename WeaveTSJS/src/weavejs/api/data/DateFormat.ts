/* ***** BEGIN LICENSE BLOCK *****
 *
 * This file is part of Weave.
 *
 * The Initial Developer of Weave is the Institute for Visualization
 * and Perception Research at the University of Massachusetts Lowell.
 * Portions created by the Initial Developer are Copyright (C) 2008-2015
 * the Initial Developer. All Rights Reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * ***** END LICENSE BLOCK ***** */

namespace weavejs.api.data
{
	import StandardLib = weavejs.util.StandardLib;

	export class DateFormat
	{
		public static getSuggestions():string[]
		{
			return DateFormat.ADDITIONAL_SUGGESTIONS.concat(DateFormat.FOR_AUTO_DETECT);
		}
		
		public static /* readonly */ ADDITIONAL_SUGGESTIONS:string[] = [
			"%Y"
		];
		public static /* readonly */ FOR_AUTO_DETECT:string[] = [
			'%-d-%b-%y',
			'%b-%-d-%y',
			'%-d-%b-%Y',
			'%b-%-d-%Y',
			'%Y-%b-%-d',
			
			'%-d/%b/%y',
			'%b/%-d/%y',
			'%-d/%b/%Y',
			'%b/%-d/%Y',
			'%Y/%b/%-d',
			
			'%-d.%b.%y',
			'%b.%-d.%y',
			'%-d.%b.%Y',
			'%b.%-d.%Y',
			'%Y.%b.%-d',
			
			'%-d-%-m-%y',
			'%-m-%-d-%y',
			'%-d-%-m-%Y',
			'%-m-%-d-%Y',
			
			'%-d/%-m/%y',
			'%-m/%-d/%y',
			'%-d/%-m/%Y',
			'%-m/%-d/%Y',
			'%Y/%-m/%-d',
			
			'%-d.%-m.%y',
			'%-m.%-d.%y',
			'%-d.%-m.%Y',
			'%-m.%-d.%Y',
			'%Y.%-m.%-d',
			
			'%H:%M',
			'%H:%M:%S',
			'%H:%M:%S.%Q',
			'%a, %d %b %Y %H:%M:%S %z', // RFC_822
			
			// ISO_8601   http://www.thelinuxdaily.com/2014/03/c-function-to-validate-iso-8601-date-formats-using-strptime/
			"%Y-%m-%d",
			"%y-%m-%d",
			"%Y-%m-%d %T",
			"%y-%m-%d %T",
			"%Y-%m-%dT%T",
			"%y-%m-%dT%T",
			"%Y-%m-%dT%TZ",
			"%y-%m-%dT%TZ",
			"%Y-%m-%d %TZ",
			"%y-%m-%d %TZ",
			"%Y%m%dT%TZ",
			"%y%m%dT%TZ",
			"%Y%m%d %TZ",
			"%y%m%d %TZ",
			
			"%Y-%b-%d %T",
			"%Y-%b-%d %H:%M:%S",
			"%Y-%b-%d %H:%M:%S.%Q",
			"%d-%b-%Y %T",
			"%d-%b-%Y %H:%M:%S",
			"%d-%b-%Y %H:%M:%S.%Q",
			
			/*
			//https://code.google.com/p/datejs/source/browse/trunk/src/globalization/en-US.js
			'M/d/yyyy',
			'dddd, MMMM dd, yyyy',
			"M/d/yyyy",
			"dddd, MMMM dd, yyyy",
			"h:mm tt",
			"h:mm:ss tt",
			"dddd, MMMM dd, yyyy h:mm:ss tt",
			"yyyy-MM-ddTHH:mm:ss",
			"yyyy-MM-dd HH:mm:ssZ",
			"ddd, dd MMM yyyy HH:mm:ss GMT",
			"MMMM dd",
			"MMMM, yyyy",
			
			//http://www.java2s.com/Code/Android/Date-Type/parseDateforlistofpossibleformats.htm
			"EEE, dd MMM yyyy HH:mm:ss z", // RFC_822
			"EEE, dd MMM yyyy HH:mm zzzz",
			"yyyy-MM-dd'T'HH:mm:ssZ",
			"yyyy-MM-dd'T'HH:mm:ss.SSSzzzz", // Blogger Atom feed has millisecs also
			"yyyy-MM-dd'T'HH:mm:sszzzz",
			"yyyy-MM-dd'T'HH:mm:ss z",
			"yyyy-MM-dd'T'HH:mm:ssz", // ISO_8601
			"yyyy-MM-dd'T'HH:mm:ss",
			"yyyy-MM-dd'T'HHmmss.SSSz",
			
			//http://stackoverflow.com/a/21737848
			"M/d/yyyy", "MM/dd/yyyy",                                    
			"d/M/yyyy", "dd/MM/yyyy", 
			"yyyy/M/d", "yyyy/MM/dd",
			"M-d-yyyy", "MM-dd-yyyy",                                    
			"d-M-yyyy", "dd-MM-yyyy", 
			"yyyy-M-d", "yyyy-MM-dd",
			"M.d.yyyy", "MM.dd.yyyy",                                    
			"d.M.yyyy", "dd.MM.yyyy", 
			"yyyy.M.d", "yyyy.MM.dd",
			"M,d,yyyy", "MM,dd,yyyy",                                    
			"d,M,yyyy", "dd,MM,yyyy", 
			"yyyy,M,d", "yyyy,MM,dd",
			"M d yyyy", "MM dd yyyy",                                    
			"d M yyyy", "dd MM yyyy", 
			"yyyy M d", "yyyy MM dd" */
		];
		
		public static convertDateFormat_c_to_moment(format:string):string
		{
			if (format && format.indexOf('%') >= 0)
				return StandardLib.replace.apply(StandardLib, [format].concat(DateFormat.dateFormat_replacements_c_to_moment));
			return format;
		}
		
		private static /* readonly */ dateFormat_replacements_c_to_moment = [
			'%Y', 'YYYY',
			'%y', 'YY',
			'%B', 'MMMM',
			'%b', 'MMM',
			'%m', 'MM',
			'%-m', 'M',
			'%d', 'DD',
			'%-d', 'D',
			'%u', 'E',
			'%p', 'A',
			'%H', 'HH',
			'%-H', 'H',
			'%I', 'hh',
			'%-I', 'h',
			'%A', 'dddd',
			'%a', 'ddd',
			'%M', 'mm',
			'%-M', 'm',
			'%S', 'ss',
			'%s', 'X',
			'%Q', 'SSS',
			'%z', 'zz',
			'%Z', 'z',
			'%%', '%'
		];
	}
}
